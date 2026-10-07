import { useContext } from "react";

import AppContext from "../store/appContext";

export default function useApp() {
  return useContext(AppContext);
}