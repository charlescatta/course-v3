/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { Redirect, useParams, Link } from '@reach/router';
import { BiMenu, BiSearch, BiArrowBack, BiArea } from 'react-icons/bi';
import Notes from '../components/Notes';
import logo from '../logo.png';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import tw from 'twin.macro';
import { theme } from '../utils/theme';
import styled from '@emotion/styled';
import { NumberParam, useQueryParams, withDefault } from 'use-query-params';
import data from '../data.json';

const Btn = ({ children, ...props }) => (
  <button css={[tw`flex items-center justify-center 
                   py-3 px-4 md:px-6 lg:px-8 text-xs lg:text-sm border
                   border-transparent font-medium
                   rounded-full focus:outline-none
                   focus:shadow-outline transition
                   duration-150 ease-in-out`]} {...props}>
    { children}
  </button>
);

// from https://usehooks.com/useOnScreen/
const useOnScreen = (ref, rootMargin = '0px') => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      observer.unobserve(currentRef);
    };
  }, [ref, rootMargin]); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
}


const Header = ({ sidebarShown, setSideBarShown }) => {
  return (
    <div tw="flex h-16 z-10 relative">
      <header tw="flex w-full h-full shadow items-center justify-between px-5 z-0">
        <div tw="flex items-center">
          <button tw="p-3 text-2xl focus:outline-none border-transparent text-gray-800 hover:text-gray-900" onClick={() => setSideBarShown(!sidebarShown)}>
            <BiMenu />
          </button>
          <a tw="ml-3 hidden md:flex" href="https://fast.ai/" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="Fast AI" tw="h-12" />
          </a>
        </div>
        <a tw="ml-3 flex md:hidden" href="https://fast.ai/" target="_blank" rel="noopener noreferrer">
          <img src={logo} alt="Fast AI" tw="h-12" />
        </a>
        <SearchInput onInput={() => alert('Work in progress, will show a dropdown with results')} />
        <span tw="hidden md:flex" />
        <Btn tw="block md:hidden bg-gray-100 text-gray-800 hover:bg-gray-200" onClick={() => alert('Work in progress, will show a search overlay')}><BiSearch tw="text-base inline"/></Btn>
      </header>
    </div>
  )
}

const SideBar = styled.aside`
  ${tw`h-full max-h-full bg-gray-100 transition-all ease-in-out duration-300 z-20 absolute md:relative flex-none md:w-0 md:shadow-inner`}
  & > div {
    ${tw`w-64 md:w-56 h-full`}
  }
  ${p => p.shown && tw`w-64 md:w-56`}
  ${p => p.shown ? `transform: translateX(0)` : `transform: translateX(-${theme.width['64']})`}
`;

const Layout = ({ children, sidebar }) => {
  const [sidebarShown, setSidebarShown] = useState(false);
  return (
    <div tw="w-full h-full max-h-full bg-white flex flex-1">
      <SideBar shown={sidebarShown}>
        {sidebar && sidebar(sidebarShown)}
      </SideBar>
      <div tw="flex flex-1 flex-col items-stretch">
        <Header sidebarShown={sidebarShown} setSideBarShown={setSidebarShown} />
        {children}
      </div>
      { sidebarShown && <div tw="bg-black opacity-50 top-0 bottom-0 right-0 left-0 absolute z-10 block md:hidden" onClick={() => setSidebarShown(false)} />}
    </div>
  )
}

const SideBarLessonSelector = () => {
  const { course, lessonIdx, partIdx: selectedPartIdx } = useSelected();
  const numParts = course.parts.length;
  return (
    <div tw="flex-1 flex-col flex overflow-y-scroll flex-no-wrap py-4">
      {course.parts.map((part, partIdx) => (
        <Fragment>
          { (numParts > 1) &&<div tw="pr-2">Part {partIdx + 1}</div> }
          <ul tw="text-center py-2">
            {
              part.map((lesson, idx) => {
                const isSelected = (lessonIdx === idx) && (partIdx === selectedPartIdx);
                return (
                  <Link to={`?lesson=${idx + 1}${(numParts > 1) ? `&part=${partIdx + 1}` : ``}`}>
                    <li css={[
                      tw`truncate py-3 px-3 text-gray-600 hover:bg-gray-300`,
                      isSelected && tw`text-white bg-gray-800 hover:bg-gray-800`
                    ]}>{lesson.shortname}</li>
                  </Link>
                )
              })
            }
          </ul>
        </Fragment>
      ))}
    </div>
  )
}

const KeyboardKey = styled.div`
  ${tw`inline-flex relative items-center justify-center select-none h-4 w-4 rounded-sm text-gray-600 bg-gray-300`}
  font-size: 6.5px;
  & > span {
    transform: translateY(-1px);
  }
  border-top: 2px solid #ddd;
  border-left: 2px solid #ccc;
  border-bottom: 1px solid #efefef;
  border-right: 1px solid #efefef;
`
const HotkeyHint = ({ hotkey }) => (
  <KeyboardKey title={`Hotkey: ${hotkey}`}><span>{hotkey}</span></KeyboardKey>
)

const useFocusHotkey = (ref, char) => {
  const keyCode = useMemo(() => String(char).charCodeAt(0), [char]);

  useEffect(() => {
    if (!ref.current) return;

    const handler = evt => {
      if (evt.keyCode === keyCode && document.activeElement !== ref.current) {
        evt.preventDefault();
        ref.current.focus();
      }
    }
    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    }
  }, [keyCode, ref]);
}

const SearchInput = ({ ...props }) => {
  const inputRef = useRef(null);
  useFocusHotkey(inputRef, ';');

  return (
    <form
      tw="hidden md:flex w-2/4 border border-gray-300 h-10 rounded-lg items-center text-gray-600 bg-white" onSubmit={evt => { evt.preventDefault(); evt.target.value = "" }}>
      <button type="submit" tw="inline-flex px-2 h-full items-center justify-center focus:outline-none">
        <BiSearch tw="inline" />
      </button>
      <input
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        ref={inputRef}
        tw="text-sm focus:outline-none h-full w-full bg-transparent"
        type="search"
        name="search"
        placeholder="Search transcript"
        {...props} />
      <div tw="inline-flex px-2 items-center justify-center">
        <HotkeyHint hotkey={";"} />
      </div>
    </form>
  )
}

const useCourseQueryParams = () => {
  const [query, setQuery] = useQueryParams({
    part: withDefault(NumberParam, undefined),
    lesson: withDefault(NumberParam, 1)
  });

  let { lesson, part } = query;

  // Decrement value by one if value is defined
  const lessonIdx = useMemo(() => lesson ? lesson - 1 : 0, [lesson]);
  const partIdx = useMemo(() => part ? part - 1 : 0, [part]);

  return { lessonIdx, partIdx, setQuery, query };
}

const useSelected = () => {
  let { slug } = useParams();
  const { lessonIdx, partIdx, setQuery } = useCourseQueryParams();

  const course = data.courses[slug];

  useEffect(() => {
    if (!course) return;
    // Remove part from url if course only has one part
    course.parts.length > 1 ? setQuery({ part: 1 }) : setQuery({ part: undefined })
  }, [course, setQuery]);

  const part = course?.parts[partIdx];
  const lesson = part ? part[lessonIdx] : null;

  return { course, part, partIdx, lesson, lessonIdx }
}

const BubbleContainer = styled.div`
  ${tw`rounded-full bg-white bg-center bg-cover h-8 w-8 overflow-hidden border -ml-2 relative`}
  ${p => `background-image: url(${p.teacher.profilePictureURL})}`}
  & > div {
    ${tw`absolute block bg-gray-500 text-gray-100`}
    bottom: -5px;
  }
`

const Bubble = ({ teacher }) => (
  <BubbleContainer teacher={teacher} />
)

const TeacherBubbles = ({ teachers, ...rest }) => (
  <div tw="flex ml-2" {...rest}>
    { teachers.map(tslug => <Bubble key={tslug} teacher={data.teachers[tslug]}></Bubble>)}
  </div>
)

export default () => {
  const { course, lesson } = useSelected();
  const videoContainerRef = useRef(null);
  const playerRef = useRef(null);
  const videoInView = useOnScreen(videoContainerRef, '-150px');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [poped, setPoped] = useState(false);

  useEffect(() => {
    setPoped(!videoInView && videoPlaying);
  }, [videoInView, setPoped, videoPlaying]);

  if (!course) return <Redirect to="/" />

  return (
    <Layout
      sidebar={
        () => (
          <div tw="w-full text-white bg-gray-100 h-full max-h-full flex flex-col">
            <div tw="p-4 mb-0 bg-blue-500 z-10 shadow">
              <p tw="text-xs font-light italic">Current course:</p>
              <h1 tw="font-bold">{course.name}</h1>
              <p tw="text-xs font-light italic mt-1">Taught by:</p>
              <TeacherBubbles tw="flex justify-center pt-2" teachers={course.teachers} />
              <Link to="/">
                <div tw="text-sm flex items-center justify-center -my-8 mt-4 py-2 px-4 rounded-full bg-green-500 font-semibold text-white hover:bg-green-600 transition-colors duration-150">
                  <BiArrowBack tw="inline mr-2" />View other courses
                </div>
              </Link>
            </div>
            <SideBarLessonSelector />
          </div>
        )
      }>
      <main tw="flex-1 overflow-scroll">
        <div tw="w-full md:h-full h-64 bg-gray-900 relative" ref={videoContainerRef}>
          <div
            css={[
              tw`transition-all duration-300 ease-out`,
              poped ? tw`fixed z-10 shadow-lg` : tw`relative h-full w-full`,
              poped && `bottom: 24px; right: 24px;`
            ]}>
            {poped && (
              <div tw="absolute flex items-center justify-around top-0 bottom-0 left-0 right-0 hover:opacity-75 opacity-0 bg-white transition duration-150">
                <button tw="rounded-full transition duration-150 p-5 text-white text-xl bg-gray-700 hover:bg-gray-600 opacity-100" onClick={() => setPoped(false)}>
                  <BiArea />
                </button>
              </div>
            )}
            <YouTubePlayer
              controls
              ref={playerRef}
              width="100%"
              height="100%"
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
              css={[poped && tw`pointer-events-none`, tw`z-20`]}
              config={{ youtube: { playerVars: { playsinline: 1, modestbranding: 1 } } }}
              url={`https://www.youtube.com/embed/${lesson.video.src}`} />
          </div>
        </div>
        <div tw="m-auto max-w-screen-lg my-5">
          <div tw="w-full bg-white">
            <h2 tw="text-4xl text-center font-bold py-2">Lesson Notes</h2>
            <hr />
            <Notes url={lesson.notes_url} />
            <hr />
          </div>
        </div>
      </main>
    </Layout>
  );
}