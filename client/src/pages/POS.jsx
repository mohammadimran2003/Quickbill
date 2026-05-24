import { Box, Grid, TextField, Typography } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import getProducts from "../api/products_api/getProducts";
import ProductCard from "../components/pos_comp/ProductCard";
import useCartStore from "../store/cartStore";
import CartList from "../components/pos_comp/CartList";
import { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import PosFilterSection from "../components/pos_comp/PosFilterSection";
import { useSearchParams } from "react-router-dom";
import ProductNotFound from "../components/pos_comp/ProductNotFound";
function POS() {
  const addItem = useCartStore((state) => state.addItem);
  const loadMoreRef = useRef(null);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const brandId = searchParams.get("brandId") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const search = searchParams.get("search") || "";

  const hasFilters = brandId || categoryId || search;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["pos-products", search, brandId, categoryId],
      queryFn: ({ pageParam = 1 }) =>
        getProducts({
          page: pageParam,
          limit: 12,
          search,
          brandId,
          categoryId,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.pagination;
        return page < totalPages ? page + 1 : undefined;
      },
    });

  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setSearchParams((prev) => {
        const currentParams = Object.fromEntries(prev);
        if (value) {
          currentParams.search = value;
        } else {
          delete currentParams.search;
        }
        return currentParams;
      });
    }, 300),
    [setSearchParams],
  );
  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedSetSearch(value);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <PosFilterSection hasFilters={hasFilters} />
        <Box>
          <TextField
            placeholder="Search here"
            size="small"
            value={searchInputValue}
            onChange={handleSearch}
          />
        </Box>
      </Box>
      <Grid container spacing={3} sx={{ mt: "20px" }}>
        <Grid size={8}>
          {allProducts.length > 0 ? (
            <Grid container spacing={2}>
              {allProducts.map((product) => (
                <Grid size={3} key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <ProductNotFound />
          )}
        </Grid>
        <Grid size={4}>
          <CartList />
        </Grid>
      </Grid>
      <Box ref={loadMoreRef} sx={{ py: 2, textAlign: "center" }}>
        {isFetchingNextPage && <CircularProgress size={24} />}
        {!hasNextPage && allProducts.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            All products displayed
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default POS;
