import React from 'react';
import { storiesOf } from '@storybook/react';
import { Title } from './example';

storiesOf('Button', module)
  .add('with text', () => (
    <Title>Hello Button</Title>
  ))
  .add('with emoji', () => (
    <Title><span role="img" aria-label="so cool">😀 😎 👍 💯</span></Title>
  )); 
