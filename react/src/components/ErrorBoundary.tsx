import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: any;
  errorInfo: any;
}

/**
 * エラー画面を描画するコンポーネントです。
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>エラーが発生しました。</h2>
          <details style={{ whiteSpace: "pre-wrap" }} open>
            <summary>詳細</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
