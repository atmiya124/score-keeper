import { Redirect } from "wouter";

/** Single match: manage live is on /admin. Redirect so one place for timer + score. */
export default function ManageMatch() {
  return <Redirect to="/admin" />;
}
