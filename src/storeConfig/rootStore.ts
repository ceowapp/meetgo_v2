import {
  configureStore,
  Middleware,
  applyMiddleware,
  compose,
  StoreEnhancer,
} from '@reduxjs/toolkit';
import {PERSIST} from 'redux-persist';
import Reactotron from './Reactotron';

import rootReducer from 'reducer/rootReducer';

// const isSerializable = () => true;
let reactotronEnhancer;
if (Reactotron.createEnhancer) {
  reactotronEnhancer = Reactotron.createEnhancer();
}
const newEnhancer: StoreEnhancer = compose(reactotronEnhancer);
const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: false,
      immutableCheck: true,
      serializableCheck: {
        ignoredActions: [PERSIST],
        // isSerializable,
      },
    }),
  enhancers: [newEnhancer],
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
