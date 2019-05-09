import { Dispatch, useCallback } from "react";

export type SideEffector<S, A> = (
  action: A,
  dispatch: Dispatch<A>,
  state: () => S
) => void;
let ss: any;
export const useSideEffector = <S, A>(
  [state, dispatch]: [S, Dispatch<A>],
  sideEffector: SideEffector<S, A>
): [S, Dispatch<A>] => {
  let dispatchSE: Dispatch<A> | null = null;

  const dispatchSECaller = useCallback(
    (action: A) => {
      dispatchSE && dispatchSE(action);
    },
    [dispatchSE]
  );
  ss = state;
  const getState = () => ss;
  dispatchSE = useCallback(
    dispatchSideEffector<S, A>(
      getState,
      dispatch,
      sideEffector,
      dispatchSECaller
    ),
    []
  );
  return [state, dispatchSE];
};

const dispatchSideEffector = <S, A>(
  state: () => S,
  dispatch: Dispatch<A>,
  sideEffector: SideEffector<S, A>,
  dispatchSECaller: Dispatch<A>
) => (action: A) => {
  dispatch(action);
  sideEffector(action, dispatchSECaller, state);
};
