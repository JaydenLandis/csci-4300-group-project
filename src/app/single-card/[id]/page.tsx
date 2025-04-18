import type { FC } from 'react';

interface SingleCardPageProps {
  params: { id: string };
}

const SingleCardPage: FC<SingleCardPageProps> = ({ params }) => {
  const { id } = params;

  // e.g. fetch(`/api/cards/${id}`) or use your data‑fetching of choice
  return (
    <div>
      <h1>Card Details</h1>
      <p>Showing card with ID: <strong>{id}</strong></p>
      {/* render the rest of your card here */}
    </div>
  );
};

export default SingleCardPage;
