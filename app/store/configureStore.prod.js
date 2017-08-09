// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory, createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import type { counterStateType } from '../reducers/counter';

// Logging Middleware
const logger = createLogger({
  level: 'info',
  collapsed: true
});

const history = createHashHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, logger, router);

function configureStore(initialState?: counterStateType) {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
