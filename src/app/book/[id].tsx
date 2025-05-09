import React from "react";
import { useRouter } from "next/router";

const ProductPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Kitob haqida batafsil</h1>
      <p>Kitob ID: {id}</p>
      <p>Bu yerda tanlangan kitob haqida to‘liq ma’lumot chiqadi.</p>
    </main>
  );
};

export default ProductPage;