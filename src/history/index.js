import { createMemoryHistory } from 'history'
const memoryHistory = createMemoryHistory();
// const history = typeof window !== 'undefined' ? memoryHistory : { push: () => {} };
const history = memoryHistory;
const navigate = to => history.push(to);
export { history, navigate };
