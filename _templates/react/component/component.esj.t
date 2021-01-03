---
to: <%= path %>/<%= name %>/<%= name %>.tsx
---
import React from 'react';
import './style.css';

interface <%= name %>Props {}

const <%= name %> = (props:<%= name %>Props)=>{
  return <div></div>
}

export {<%= name %>, <%= name %>Props}