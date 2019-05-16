import { Dispatch, useCallback, useMemo } from "react";

export type SideEffector<S, A> = (
  action: A,
  dispatch: Dispatch<A>,
  state: () => S
) => void;
const stateStoreFactory = <S>() => {
  let state: S;
  return {
    getter: () => state,
    setter: (newState: S) => {
      state = newState;
    }
  };
};
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
  const stateStore = useMemo(() => stateStoreFactory<S>(), []);

  stateStore.setter(state);
  dispatchSE = useCallback(
    dispatchSideEffector<S, A>(
      stateStore.getter,
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
