/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Router, globalHistory } from '@reach/router';
import { Suspense, lazy } from 'react';
import { QueryParamProvider } from 'use-query-params';
import Index from './routes/Index';
import tw, { css } from 'twin.macro';

const Course = lazy(() => import('./routes/Course'));


export default () => (
  <Suspense fallback={<h1>Loading...</h1>}>
    {/* hack since QueryParamProvider does not allow styling via tw prop */}
    <Router css={[css`&, & > div {${tw`h-full`}}`]}>
      <QueryParamProvider {...{ path: '/' }} reachHistory={globalHistory}>
        <Index path="/" />
        <Course path="/course/:slug" />
      </QueryParamProvider>
    </Router>
  </Suspense>
);