import { useState } from "react";
import { Box, Button, Grid, GridItem, IconButton } from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useColors } from "@/styles/theme";
import { Template, TemplateBlock } from "@/types/template";

interface TemplateLayoutProps {
  template: Template;
  onUpdate: (layout: Template["layout"]) => void;
}

export function TemplateLayout({ template, onUpdate }: TemplateLayoutProps) {
  const colors = useColors();
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  const handleAddSection = () => {
    const newLayout = [...template.layout];
    newLayout.push({
      blockId: Date.now().toString(),
      x: 0,
      y: newLayout.length,
      w: 12,
      h: 1,
      widget: {
        type: "DEFAULT",
      },
    });
    onUpdate(newLayout);
  };

  const handleDeleteSection = (index: number) => {
    const newLayout = [...template.layout];
    newLayout.splice(index, 1);
    onUpdate(newLayout);
  };

  const handleUpdateSection = (index: number, section: TemplateBlock) => {
    const newLayout = [...template.layout];
    newLayout[index] = section;
    onUpdate(newLayout);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Button onClick={handleAddSection} colorScheme="blue" variant="solid">
          <AddIcon />
          섹션 추가
        </Button>
      </Box>

      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        {template.layout.map((section, index) => (
          <GridItem
            key={section.blockId}
            colSpan={12}
            p={4}
            border="1px"
            borderColor={colors.border}
            borderRadius="md"
            position="relative"
          >
            <IconButton
              aria-label="Delete section"
              size="sm"
              position="absolute"
              top={2}
              right={2}
              onClick={() => handleDeleteSection(index)}
              variant="ghost"
            />
            <DeleteIcon />
            {/* Section content will be added here */}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
