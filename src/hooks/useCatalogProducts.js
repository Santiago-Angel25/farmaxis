import { useEffect, useState } from "react";

const API_CATEGORIES = ["beauty", "skin-care", "groceries"];
const DEMO_COP_PER_USD = 4000;

function mapApiProduct(product) {
  const discount = Math.round(product.discountPercentage ?? 0);
  const priceInCop = Math.round(product.price * DEMO_COP_PER_USD);

  return {
    id: "dummyjson-" + product.id,
    name: product.title,
    price: priceInCop,
    previousPrice:
      discount > 0
        ? Math.round(priceInCop / (1 - discount / 100))
        : undefined,
    image: product.thumbnail || product.images?.[0] || "",
    category: product.category,
    discount: discount > 0 ? discount : undefined,
    availability: "Producto de demostración",
  };
}

export default function useCatalogProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const responses = await Promise.all(
          API_CATEGORIES.map((category) =>
            fetch(
              "https://dummyjson.com/products/category/" +
                category +
                "?limit=0",
              { signal: controller.signal },
            ),
          ),
        );

        const failedResponse = responses.find((response) => !response.ok);
        if (failedResponse) {
          throw new Error("No se pudieron cargar los productos.");
        }

        const categoryResults = await Promise.all(
          responses.map((response) => response.json()),
        );

        setProducts(
          categoryResults.flatMap((result) =>
            (result.products ?? []).map(mapApiProduct),
          ),
        );
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Ocurrió un error al cargar productos.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, []);

  return { products, loading, error };
}
