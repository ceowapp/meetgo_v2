import {
  configureStore,
} from '@reduxjs/toolkit';
import {PERSIST} from 'redux-persist';
import Reactotron from './Reactotron';
import rootReducer from 'reducer/rootReducer';

// Create the store with middleware and enhancers
const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: false,
      immutableCheck: true,
      serializableCheck: {
        ignoredActions: [PERSIST],
      },
    }),
  enhancers: getDefaultEnhancers => {
    // Create a new array of enhancers
    const enhancers = [];
    
    // Add Reactotron enhancer if available
    if (Reactotron.createEnhancer) {
      enhancers.push(Reactotron.createEnhancer());
    }
    
    // Return the combined enhancers
    return enhancers.length > 0 
      ? getDefaultEnhancers().concat(enhancers)
      : getDefaultEnhancers();
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;