import React, {useRef} from 'react';
import {FlatList, FlatListProps} from 'react-native';

type FlatListLoadMoreProps = Omit<
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  FlatListProps<any>,
  | 'onScrollBeginDrag'
  | 'onMomentumScrollBegin'
  | 'onEndReached'
  | 'onEndReachedThreshold'
> & {
  onLoadMore: () => void;
};
const FlatListLoadMore = (props: FlatListLoadMoreProps): React.ReactElement => {
  const {onLoadMore} = props;
  const callOnEndReached = useRef<boolean>(false);
  const onBeginScroll = () => {
    callOnEndReached.current = true;
  };
  const handleLoadMore = () => {
    if (callOnEndReached.current) {
      onLoadMore();
      callOnEndReached.current = false;
    }
  };

  return (
    <FlatList
      {...props}
      onScrollBeginDrag={onBeginScroll}
      onMomentumScrollBegin={onBeginScroll}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.2}
    />
  );
};

export default FlatListLoadMore;
