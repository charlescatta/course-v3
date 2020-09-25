/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Link } from '@reach/router';
import { FaPlay, FaTwitter } from 'react-icons/fa';
import 'twin.macro';

import data from '../data.json';

const CourseCard = ({ course, slug, ...props }) => (
  <Link to={`/course/${slug}`}>
    <div tw="shadow-md hover:shadow-lg transition-all duration-150 ease-out rounded-md overflow-hidden bg-white mx-2">
      <div tw="bg-cover bg-center w-full h-48" style={{ backgroundImage: `url('https://picsum.photos/500?random=${slug}')` }}>
      </div>
      <h3 tw="mb-2 font-bold text-lg">{course.name}</h3>
      <div tw="flex p-5">
        <p tw="text-gray-600 text-sm">{course.description || ''}</p>
        <div>
          <button tw="bg-gray-300 hover:bg-blue-600 focus:outline-none text-gray-800 hover:text-white block transition-colors duration-150 flex justify-center items-center rounded-full h-12 w-12 p-2"><FaPlay tw="text-sm inline ml-1"/></button>
        </div>
      </div>
    </div>
  </Link>
);

export default () => {
  return (
    <main tw="flex flex-col items-center justify-center min-h-screen m-auto max-w-screen-xl">
      <h1 tw="text-4xl font-semibold my-5">Fast.ai Course List</h1>
      <div tw="flex flex-col md:w-3/4 p-4 bg-red-600 text-white rounded-lg my-4">
        <h2 tw="font-bold text-xl text-center py-2">Work In Progress</h2>
        <h3 tw="uppercase text-base tracking-tight font-semibold">Todos:</h3>
        <ul tw="text-sm ml-2 list-disc list-inside">
          <li>Finish transcript search UI</li>
          <li>Add course Quick Links to the bottom of the sidebar</li>
          <li>Find images and write a short description for each course</li>
          <li>Improve the course selection page UI</li>
          <li>Implement accordion UI for multipart courses</li>
          <li>Disable scroll down picture in picture on mobile</li>
        </ul>
        <div tw="flex flex-1 justify-center mt-3">
          <a 
            target="_blank"
            rel="noreferrer noopener"
            tw="text-base bg-red-700 hover:bg-red-800 font-semibold transition-colors duration-150 px-4 py-3 rounded-lg"
            href="https://twitter.com/charles_catta"><FaTwitter tw="inline mr-2"/>Send Feedback</a>
        </div>
      </div>
      <div tw="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
        {Object.keys(data.courses).map(slug => (
          <CourseCard key={slug} slug={slug} course={data.courses[slug]} />
        ))}
      </div>
    </main>
  )
}