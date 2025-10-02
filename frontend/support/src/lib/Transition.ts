import { Transition as T } from "react-transition-group";

const Transition: any = T;
Transition.prototype.onTransitionEnd = function onTransitionEnd(
  timeout: any,
  handler: any
) {
  this.setNextCallback(handler);
  const node = this.props.nodeRef.current;

  const doesNotHaveTimeoutOrListener =
    timeout == null && !this.props.addEndListener;
  if (!node || doesNotHaveTimeoutOrListener) {
    setTimeout(this.nextCallback, 0);
    return;
  }

  if (this.props.addEndListener) {
    this.props.addEndListener(this.nextCallback, this.state.status);
  }

  if (timeout != null) {
    setTimeout(this.nextCallback, timeout);
  }
};

export { Transition };
