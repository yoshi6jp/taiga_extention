import { Dispatch, useCallback } from "react";

export type SideEffector<S, A> = (
  action: A,
  dispatch: Dispatch<A>,
  state: S
) => void;

export const useSideEffector = <S, A>(
  [state, dispatch]: [S, Dispatch<A>],
  sideEffector: SideEffector<S, A>
): [S, Dispatch<A>] => {
  const dispatchSECaller = useCallback((action: A) => {
    dispatchSE(action);
  }, []);
  const dispatchSE = useCallback(
    dispatchSideEffector(state, dispatch, sideEffector, dispatchSECaller),
    [
      state
      // dispatch
    ]
  );
  return [state, dispatchSE];
};

const dispatchSideEffector = <S, A>(
  state: S,
  dispatch: Dispatch<A>,
  sideEffector: SideEffector<S, A>,
  dispatchSECaller: Dispatch<A>
) => (action: A) => {
  dispatch(action);
  sideEffector(action, dispatchSECaller, state);
};
