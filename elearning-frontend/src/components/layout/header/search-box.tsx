import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { FC, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useSearchCourses } from './hooks/use-search-courses';
import { useClickAway, useDebounce } from 'react-use';
import Link from 'next/link';
import { pageList } from '@/constants/page-list';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const SearchBox: FC = () => {
  const router = useRouter();

  const queryKeyword = router.query.keyword as string | undefined;
  const [keyword, setKeyword] = useState(queryKeyword || '');
  useEffect(() => {
    if (queryKeyword) {
      setKeyword(queryKeyword);
    }
  }, [queryKeyword]);

  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  useDebounce(
    () => {
      setDebouncedKeyword(keyword);
    },
    300,
    [keyword],
  );

  const [showCourses, setShowCourses] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`${pageList.courses.root}?keyword=${keyword}`);
      setShowCourses(false);
      inputRef.current?.blur();
    }
  };

  const { courses } = useSearchCourses(debouncedKeyword);

  useEffect(() => {
    if (courses && courses.length > 0) {
      setShowCourses(true);
    } else {
      setShowCourses(false);
    }
  }, [courses]);
  const searchRef = useRef<HTMLDivElement>(null);
  useClickAway(searchRef, () => {
    setShowCourses(false);
  });

  return (
    <div
      ref={searchRef}
      className="relative flex max-w-3xl flex-1 items-center rounded-md border-2 border-[#D0DBE9] p-1"
    >
      <Search className="cursor-pointer text-muted-foreground" />
      <Input
        ref={inputRef}
        value={keyword}
        onFocus={() => {
          if (courses && courses.length > 0) {
            setShowCourses(true);
          }
        }}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleEnter}
        placeholder="Tìm khóa học ..."
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {showCourses && (
        <div className="absolute left-0 right-0 top-full z-20 translate-y-2 border bg-white shadow">
          {courses?.map((course) => (
            <Link
              href={pageList.courses.detail(course.id)}
              key={course.id}
              className="flex items-stretch gap-4 rounded-md p-3 hover:bg-muted"
            >
              <div className="relative w-24">
                <Image
                  src={course.thumbnail}
                  alt="thumbnail"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">{course.title}</p>
                <div className="flex items-center gap-2">
                  <div className="relative aspect-square w-9">
                    <Avatar>
                      <AvatarImage src={course.teacher.avatar || undefined} />
                      <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                  </div>
                  <p>{course.teacher.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
