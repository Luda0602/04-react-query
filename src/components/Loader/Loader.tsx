import css from "./ Loader.module.css";
import { BeatLoader } from "react-spinners";

export default function Loader() {
  return (
    <div>
      <BeatLoader className={css.loader} color="white" />
    </div>
  );
}