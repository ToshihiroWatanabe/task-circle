import React from "react";

/**
 * エラー画面を表示するクラスコンポーネントです。
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // 以下のコンポーネントでエラーをキャッチし、エラーメッセージを表示して再レンダリングします。
    this.setState({ error, errorInfo });
    // ここでエラーメッセージをエラー報告サービスに記録することもできます。
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
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
    // 通常、ただ子要素を描画するだけ
    return this.props.children;
  }
}

export default ErrorBoundary;
