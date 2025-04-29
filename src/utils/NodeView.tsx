/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

/**
 * @param Component - passing component want to render (Text, View, TextInput, TouchableOpacity, .v.v..)
 * @param content - all of thing want to render in inside component
 * @param defaultProps - all of props want to using in this component
 * Ex:  renderNode(Text, 'content', {
          style: {backgroundColor: 'red},
        })
 */
const renderNode = (
  Component: any,
  content: any,
  defaultProps: any = {},
): null | React.ReactElement => {
  if (content == null || content === false) {
    return null;
  }
  if (React.isValidElement(content)) {
    return content;
  }
  if (content && typeof content === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return content();
  }
  if (typeof content === 'string') {
    if (content.length === 0) {
      return null;
    }
    return <Component {...defaultProps}>{content}</Component>;
  }
  if (typeof content === 'number') {
    return <Component {...defaultProps}>{content}</Component>;
  }
  return <Component {...defaultProps} {...content} />;
};

export default renderNode;
