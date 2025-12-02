/** biome-ignore-all lint/style/noNonNullAssertion: <not needed> */
import { render } from "preact";
import "./index.css";

render(<h1>APP</h1>, document.getElementById("app")!);
