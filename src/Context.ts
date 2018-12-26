import React, { createContext, useReducer } from 'react';
export interface IState {
  url: string;
}
export const initialState: IState = {
  url: ''
};
export interface IAction {
  type: string;
  payload: any;
}
export const Actions = {
  SET_URL: 'SET_URL'
};
export const reducer = (state: IState = initialState, action: IAction) => {
  switch (action.type) {
    case Actions.SET_URL: {
      return { ...state, url: action.payload.url || '' };
    }
    default: {
      return state;
    }
  }
};
export const Context = createContext<IState>(initialState);
// const [state, dispatch] = useReducer(reducer, initialState);
// export const Provider = ({ children }: { children: React.ReactNode }) => {
//   return <Context.Provider value={state,dispatch}>{children}</Context.Provider>;
// }
// ;
