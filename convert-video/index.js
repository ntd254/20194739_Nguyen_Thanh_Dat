const { exec } = require('child_process');
const path = require('path');
const { mkdir, writeFile, rmdir, readdir } = require('fs/promises');
const { createReadStream } = require('fs');
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
exports.handler = async (event) => {
  const bucketName = event.Records[0].s3.bucket.name;
  const Key = event.Records[0].s3.object.key;
  console.log(`File key: ${Key}`);

  const s3Client = new S3Client();

  const fileNameNoEx = path.basename(Key, path.extname(Key));
  const fileName = path.basename(Key);

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: Key,
  });

  const response = await s3Client.send(command);

  const body = await response.Body.transformToByteArray();

  const rawFilePath = path.join('/tmp', 'raw', fileNameNoEx);
  const processedFilePath = path.join('/tmp', 'processed', fileNameNoEx);

  await Promise.all([
    mkdir(rawFilePath, { recursive: true }),
    mkdir(processedFilePath, { recursive: true }),
  ]);

  await writeFile(path.join(rawFilePath, fileName), body);

  await encodeHLSWithMultipleVideoStreams(
    path.join(rawFilePath, fileName),
    processedFilePath
  );
  console.log(`Complete encode video: ${fileName}`);

  const paths = await readdir(processedFilePath, {
    recursive: true,
    withFileTypes: true,
  });

  const absoluteFilePaths = paths
    .filter((pathName) => pathName.isFile())
    .map((pathName) => path.join(pathName.path, pathName.name));

  const requests = absoluteFilePaths.map((filePath) => {
    const objectKey = path.join(
      'videos/processed',
      path.relative('/tmp/processed', filePath)
    );

    const command = new PutObjectCommand({
      Body: createReadStream(filePath),
      Bucket: bucketName,
      Key: objectKey,
    });

    return s3Client.send(command);
  });

  const removeRawFile = new DeleteObjectCommand({
    Bucket: bucketName,
    Key,
  });
  requests.push(s3Client.send(removeRawFile));

  await Promise.all(requests);
  console.log(`Complete upload video and remove raw file: ${fileName}`);

  await Promise.all([
    rmdir(rawFilePath, { recursive: true }),
    rmdir(processedFilePath, { recursive: true }),
  ]);
  console.log(`Complete remove tmp file on lambda: ${fileName}`);

  await fetch(
    `${process.env.API_URL}/api/courses/complete-convert-video?objectId=${fileNameNoEx}`,
    {
      headers: {
        Authorization: process.env.TOKEN,
      },
    }
  );
};

const BITRATE_480P = 0.5 * 10 ** 6; // 0.5Mbps
const BITRATE_720P = 1.5 * 10 ** 6; // 1.5Mbps
const BITRATE_1080P = 3 * 10 ** 6; // 3Mbps

const checkVideoHasAudio = async (filePath) => {
  return new Promise((resolve, reject) => {
    const command = `ffprobe -v error -select_streams a:0 -show_entries stream=codec_type -of default=nw=1:nk=1 ${filePath}`;

    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
      }
      resolve(stdout.trim() === 'audio');
    });
  });
};

const getBitrate = async (filePath) => {
  const command = `ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${filePath}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
      }
      resolve(Number(stdout.trim()));
    });
  });
};

const getResolution = async (filePath) => {
  const command = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${filePath}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
      }
      const resolution = stdout.trim().split('x');
      const [width, height] = resolution;
      resolve({
        width: Number(width),
        height: Number(height),
      });
    });
  });
};

const getWidth = (height, resolution) => {
  const width = Math.round((height * resolution.width) / resolution.height);
  // Vì ffmpeg yêu cầu width và height phải là số chẵn
  return width % 2 === 0 ? width : width + 1;
};

const encodeMax480 = async ({
  bitrate,
  inputPath,
  isHasAudio,
  outputPath,
  outputSegmentPath,
  resolution,
}) => {
  const args = ['-y', '-i', inputPath, '-preset', 'ultrafast', '-map', '0:0'];
  if (isHasAudio) {
    args.push('-map', '0:1');
  }
  args.push(
    '-s:v:0',
    `${getWidth(480, resolution)}x480`,
    '-c:v:0',
    'libx264',
    '-b:v:0',
    `${bitrate[480]}`,
    '-c:a',
    'copy',
    '-var_stream_map'
  );
  if (isHasAudio) {
    args.push('v:0,a:0');
  } else {
    args.push('v:0');
  }
  args.push(
    '-master_pl_name',
    'master.m3u8',
    '-f',
    'hls',
    '-hls_time',
    '10',
    '-hls_list_size',
    '0',
    '-hls_segment_filename',
    outputSegmentPath,
    outputPath
  );

  const command = `ffmpeg ${args.join(' ')}`;

  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });
};

const encodeMax720 = async ({
  bitrate,
  inputPath,
  isHasAudio,
  outputPath,
  outputSegmentPath,
  resolution,
}) => {
  const args = ['-y', '-i', inputPath, '-preset', 'ultrafast'];
  if (isHasAudio) {
    args.push('-map', '0:0', '-map', '0:1', '-map', '0:0', '-map', '0:1');
  } else {
    args.push('-map', '0:0', '-map', '0:0');
  }
  args.push(
    '-s:v:0',
    `${getWidth(480, resolution)}x480`,
    '-c:v:0',
    'libx264',
    '-b:v:0',
    `${bitrate[480]}`,
    '-s:v:1',
    `${getWidth(720, resolution)}x720`,
    '-c:v:1',
    'libx264',
    '-b:v:1',
    `${bitrate[720]}`,
    '-c:a',
    'copy',
    '-var_stream_map'
  );
  if (isHasAudio) {
    args.push('"v:0,a:0 v:1,a:1"');
  } else {
    args.push('v:0 v:1');
  }
  args.push(
    '-master_pl_name',
    'master.m3u8',
    '-f',
    'hls',
    '-hls_time',
    '10',
    '-hls_list_size',
    '0',
    '-hls_segment_filename',
    outputSegmentPath,
    outputPath
  );

  const command = `ffmpeg ${args.join(' ')}`;

  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });
};

const encodeMax1080 = async ({
  bitrate,
  inputPath,
  isHasAudio,
  outputPath,
  outputSegmentPath,
  resolution,
}) => {
  const args = ['-y', '-i', inputPath, '-preset', 'ultrafast'];
  if (isHasAudio) {
    args.push(
      '-map',
      '0:0',
      '-map',
      '0:1',
      '-map',
      '0:0',
      '-map',
      '0:1',
      '-map',
      '0:0',
      '-map',
      '0:1'
    );
  } else {
    args.push('-map', '0:0', '-map', '0:0', '-map', '0:0');
  }
  args.push(
    '-s:v:0',
    `${getWidth(480, resolution)}x480`,
    '-c:v:0',
    'libx264',
    '-b:v:0',
    `${bitrate[480]}`,
    '-s:v:1',
    `${getWidth(720, resolution)}x720`,
    '-c:v:1',
    'libx264',
    '-b:v:1',
    `${bitrate[720]}`,
    '-s:v:2',
    `${getWidth(1080, resolution)}x1080`,
    '-c:v:2',
    'libx264',
    '-b:v:2',
    `${bitrate[1080]}`,
    '-c:a',
    'copy',
    '-var_stream_map'
  );
  if (isHasAudio) {
    args.push('"v:0,a:0 v:1,a:1 v:2,a:2"');
  } else {
    args.push('"v:0 v:1 v:2"');
  }
  args.push(
    '-master_pl_name',
    'master.m3u8',
    '-f',
    'hls',
    '-hls_time',
    '10',
    '-hls_list_size',
    '0',
    '-hls_segment_filename',
    outputSegmentPath,
    outputPath
  );

  const command = `ffmpeg ${args.join(' ')}`;

  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });
};

const encodeMaxOriginal = async ({
  bitrate,
  inputPath,
  isHasAudio,
  outputPath,
  outputSegmentPath,
  resolution,
}) => {
  const args = ['-y', '-i', inputPath, '-preset', 'ultrafast'];
  if (isHasAudio) {
    args.push(
      '-map',
      '0:0',
      '-map',
      '0:1',
      '-map',
      '0:0',
      '-map',
      '0:1',
      '-map',
      '0:0',
      '-map',
      '0:1'
    );
  } else {
    args.push('-map', '0:0', '-map', '0:0', '-map', '0:0');
  }
  args.push(
    '-s:v:0',
    `${getWidth(480, resolution)}x480`,
    '-c:v:0',
    'libx264',
    '-b:v:0',
    `${bitrate[480]}`,
    '-s:v:1',
    `${getWidth(720, resolution)}x720`,
    '-c:v:1',
    'libx264',
    '-b:v:1',
    `${bitrate[720]}`,
    '-s:v:2',
    `${resolution.width}x${resolution.height}`,
    '-c:v:2',
    'libx264',
    '-b:v:2',
    `${bitrate.original}`,
    '-c:a',
    'copy',
    '-var_stream_map'
  );
  if (isHasAudio) {
    args.push('"v:0,a:0 v:1,a:1 v:2,a:2"');
  } else {
    args.push('"v:0 v:1 v:2"');
  }
  args.push(
    '-master_pl_name',
    'master.m3u8',
    '-f',
    'hls',
    '-hls_time',
    '10',
    '-hls_list_size',
    '0',
    '-hls_segment_filename',
    outputSegmentPath,
    outputPath
  );

  const command = `ffmpeg ${args.join(' ')}`;

  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });
};

const encodeHLSWithMultipleVideoStreams = async (inputPath, outputPrefix) => {
  const [bitrate, resolution] = await Promise.all([
    getBitrate(inputPath),
    getResolution(inputPath),
  ]);
  const outputSegmentPath = path.join(outputPrefix, 'v%v/fileSequence%d.ts');
  const outputPath = path.join(outputPrefix, 'v%v/prog_index.m3u8');
  const isHasAudio = await checkVideoHasAudio(inputPath);
  let encodeFunc = encodeMax480;
  if (resolution.height > 480) {
    encodeFunc = encodeMax720;
  }
  if (resolution.height > 720) {
    encodeFunc = encodeMax1080;
  }
  if (resolution.height > 1080) {
    encodeFunc = encodeMaxOriginal;
  }
  await encodeFunc({
    bitrate: {
      480: BITRATE_480P,
      720: BITRATE_720P,
      1080: BITRATE_1080P,
      original: bitrate,
    },
    inputPath,
    isHasAudio,
    outputPath,
    outputSegmentPath,
    resolution,
  });
  return true;
};
