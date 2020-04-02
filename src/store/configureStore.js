// import { __PRODUCTION__ } from 'environs';
import prodStore from './configureStore.prod';
import devStore from './configureStore.dev';
export default (process.env.NODE_ENV == 'production' ? prodStore : devStore);
