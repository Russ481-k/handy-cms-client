"use client";

import { Box, Skeleton, VStack } from "@chakra-ui/react";

export function TemplateSkeleton() {
  return (
    <VStack gap={0} align="stretch">
      {[...Array(5)].map((_, index) => (
        <Box key={index} p={4} borderBottom="1px" borderColor="gray.200">
          <Skeleton height="20px" width="60%" />
        </Box>
      ))}
    </VStack>
  );
}
