import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import getProducts from "../api/products_api/getProducts.js";
import ProductCard from "../components/pos_comp/ProductCard.jsx";
import useCartStore from "../store/cartStore.jsx";
import CartList from "../components/pos_comp/CartList.jsx";
import { Suspense, useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import PosFilterSection from "../components/pos_comp/PosFilterSection.jsx";
import { useSearchParams } from "react-router-dom";
import ProductNotFound from "../components/pos_comp/ProductNotFound.jsx";
import { useTheme } from "@mui/material";
import ProductSkeleton from "../components/shared/skeletons/ProductSkeleton.jsx";

function POS() {
  const theme = useTheme();
  const addItem = useCartStore((state) => state.addItem);
  const loadMoreRef = useRef(null);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const brand = searchParams.get("brand") || "";
  const category = searchParams.get("category") || "";
  const productName = searchParams.get("productName") || "";

  const hasFilters = brand || category || productName;

  const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["products", productName, brand, category],
      queryFn: ({ pageParam = 1 }) =>
        getProducts({
          page: pageParam,
          limit: 12,
          productName,
          brand,
          category,
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
          currentParams.productName = value;
        } else {
          delete currentParams.productName;
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 100,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(33, 43, 54, 0.8)"
              : "rgba(255,255,255,0.5)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          p: 2,
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
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid
          size={8}
          sx={{
            overflowY: "auto",
            maxHeight: "90vh",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "3px",
            },
          }}
        >
          {isLoading ? (
            <Grid container spacing={2}>
              {[...Array(12)].map((_, i) => (
                <Grid size={3} key={i}>
                  <ProductSkeleton />
                </Grid>
              ))}
            </Grid>
          ) : allProducts.length > 0 ? (
            <Grid>
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

              <Box ref={loadMoreRef} sx={{ py: 2, textAlign: "center" }}>
                {isFetchingNextPage && <CircularProgress size={24} />}
                {!hasNextPage && allProducts.length > 0 && (
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 4 }}
                  >
                    All products displayed
                  </Typography>
                )}
              </Box>
            </Grid>
          ) : (
            <ProductNotFound />
          )}
        </Grid>

        <Grid size={4} sx={{ overflowY: "auto", maxHeight: "90%", pb: 10 }}>
          <CartList />
        </Grid>
      </Grid>
    </Box>
  );
}

export default POS;
