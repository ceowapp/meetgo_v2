import {persistStore} from 'redux-persist';
import rootStore from './rootStore';

const persistor = persistStore(rootStore);

export default {rootStore, persistor};
