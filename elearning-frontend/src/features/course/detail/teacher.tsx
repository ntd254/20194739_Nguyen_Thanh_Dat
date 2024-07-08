import { FC, useMemo } from 'react';
import { useUserDetail } from './hooks/use-user-detail';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPlayCircle,
  FaTwitter,
  FaUsers,
  FaYoutube,
} from 'react-icons/fa';
import { Website } from '@/client-sdk';
import { IoStar } from 'react-icons/io5';
import { IoIosRibbon } from 'react-icons/io';

type Props = {
  userId: string;
};

const Teacher: FC<Props> = ({ userId }) => {
  const user = useUserDetail(userId);

  const numberOfStudents = useMemo(() => {
    if (!user) {
      return 0;
    }

    return user.teachingCourses.reduce(
      (acc, course) => acc + course.numberOfStudents,
      0,
    );
  }, [user]);
  const numberOfRating = useMemo(() => {
    if (!user) {
      return 0;
    }

    return user.teachingCourses.reduce(
      (acc, course) => acc + course.totalRating,
      0,
    );
  }, [user]);
  const totalRating = useMemo(() => {
    if (!user) {
      return 0;
    }

    return user.teachingCourses.reduce(
      (acc, course) => acc + course.sumRating,
      0,
    );
  }, [user]);

  return (
    <div className="mt-9">
      <div className="text-2xl font-semibold">Người hướng dẫn</div>
      <div className="mt-4">
        <div className="flex items-start gap-5">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user?.avatar || undefined} />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <IoStar size={20} />
              {numberOfRating && (totalRating / numberOfRating).toFixed(1)}/5
              Đánh giá trung bình khóa học
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <IoIosRibbon size={20} /> {numberOfRating} lượt đánh giá
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <FaUsers size={20} /> {numberOfStudents} học viên
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <FaPlayCircle size={20} /> {user?.teachingCourses.length} khóa học
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-lg font-semibold">{user?.name}</div>
          <div className="whitespace-pre-line text-gray-500">{user?.bio}</div>
          <div className="mt-1 flex items-center gap-2">
            {user?.links.map((link) => (
              <a
                href={link.url}
                key={link.id}
                target="_blank"
                className="block p-1 transition-all hover:-translate-y-1 hover:scale-110"
              >
                {link.website === Website.FACEBOOK ? (
                  <FaFacebook size={35} />
                ) : link.website === Website.LINKEDIN ? (
                  <FaLinkedin size={35} />
                ) : link.website === Website.TWITTER ? (
                  <FaTwitter size={35} />
                ) : link.website === Website.GITHUB ? (
                  <FaGithub size={35} />
                ) : link.website === Website.YOUTUBE ? (
                  <FaYoutube size={38} />
                ) : link.website === Website.INSTAGRAM ? (
                  <FaInstagram size={35} />
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
