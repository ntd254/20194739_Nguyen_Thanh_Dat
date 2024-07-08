import { Website } from '@/client-sdk';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FC } from 'react';
import { ControllerRenderProps } from 'react-hook-form';

type Props = {
  field: ControllerRenderProps<
    {
      avatar: string;
      name: string;
      bio: string;
      links?:
        | {
            url: string;
            website: Website;
          }[]
        | undefined;
    },
    `links.${number}`
  >;
};

const UrlInput: FC<Props> = ({ field }) => {
  return (
    <div
      className="flex w-full items-stretch"
      ref={field.ref}
      onBlur={field.onBlur}
    >
      <Select
        value={field.value.website}
        onValueChange={(value) => {
          field.onChange({ ...field.value, website: value });
        }}
      >
        <SelectTrigger className="w-[180px] rounded-r-none focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="Chọn trang web" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="FACEBOOK">Facebook</SelectItem>
          <SelectItem value="YOUTUBE">Youtube</SelectItem>
          <SelectItem value="TWITTER">Twitter</SelectItem>
          <SelectItem value="GITHUB">Github</SelectItem>
          <SelectItem value="LINKEDIN">Linkedin</SelectItem>
          <SelectItem value="INSTAGRAM">Instagram</SelectItem>
        </SelectContent>
      </Select>
      <Input
        className="flex-1 rounded-l-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        value={field.value.url}
        onChange={(e) =>
          field.onChange({ ...field.value, url: e.target.value })
        }
      />
    </div>
  );
};

export default UrlInput;
