import * as ReactDOM from "react-dom";
import { Transition as T } from "react-transition-group";

const Transition = T;
Transition.prototype.onTransitionEnd = function onTransitionEnd(
  timeout,
  handler
) {
  this.setNextCallback(handler);
  const node = this.props.nodeRef.current;
  // const node = this.props.nodeRef
  // ? this.props.nodeRef.current
  // : ReactDOM.findDOMNode(this);

  const doesNotHaveTimeoutOrListener =
    timeout == null && !this.props.addEndListener;
  if (!node || doesNotHaveTimeoutOrListener) {
    setTimeout(this.nextCallback, 0);
    return;
  }

  if (this.props.addEndListener) {
    // const [maybeNode, maybeNextCallback] = this.props.nodeRef
    //   ? [this.nextCallback]
    //   : [node, this.nextCallback];
    // this.props.addEndListener(maybeNode, maybeNextCallback, this.state.status);
    this.props.addEndListener(this.nextCallback, this.state.status);
  }

  if (timeout != null) {
    setTimeout(this.nextCallback, timeout);
  }
};

export { Transition };
