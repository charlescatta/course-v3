import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import SyntaxHighlighter from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';

const StyledMarkdown = styled(ReactMarkdown)`
  padding: 12px 24px;
  p {
    line-height: 1.5em;
    margin-bottom: 24px;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 24px;
    font-weight: bold;
  }
`;

const CACHE = {}

const fetchURL = async (url) => {
  const cache = CACHE[url];
  if (cache) return cache;

  const res = await fetch(url);
  const text = await res.text();
  CACHE[url] = text;
  return text;
}

const CodeBlock = ({ language, value }) => (
  <SyntaxHighlighter language={language}>
    {value}
  </SyntaxHighlighter>
);

const Notes = ({ url }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => { 
    fetchURL(url)
    .then(text => setNotes(text))
    .catch(err => console.error(err))
  }, [url]);

  return (
    <StyledMarkdown linkTarget="_blank" source={notes} renderers={{ code: CodeBlock }} />
  )
}

export default Notes
