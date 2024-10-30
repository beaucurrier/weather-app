import ResetPassword from "../../components/ResetPassword";

export async function getServerSideProps(context: any) {
  const { token = "", email = "" } = context.query;

  // Pass token and email as props to ResetPassword component
  return {
    props: {
      searchParams: { token, email },
    },
  };
}

export default function ResetPasswordPage({ searchParams }: { searchParams: { token: string; email: string } }) {
  return <ResetPassword searchParams={searchParams} />;
}