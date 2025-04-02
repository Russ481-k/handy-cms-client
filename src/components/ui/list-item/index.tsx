import { useRef } from "react";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useColors } from "@/styles/theme";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useDrag } from "react-dnd";

export interface ListItemProps {
  id: number;
  name: string;
  icon: React.ReactElement;
  isSelected?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  renderBadges?: () => React.ReactNode;
  renderDetails?: () => React.ReactNode;
  onClick?: () => void;
  index?: number;
  level?: number;
  isDragging?: boolean;
}

export function ListItem({
  id,
  name,
  icon,
  isSelected,
  onEdit,
  onDelete,
  renderBadges,
  renderDetails,
  onClick,
  index,
  level,
  isDragging,
}: ListItemProps) {
  const colors = useColors();
  const ref = useRef<HTMLDivElement>(null);

  // 색상 설정
  const hoverBg = useColorModeValue(
    colors.secondary.light,
    colors.secondary.dark
  );
  const selectedBg = useColorModeValue(
    `${colors.primary.default}20`,
    `${colors.primary.default}20`
  );
  const selectedBorderColor = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );
  const indicatorColor = useColorModeValue(
    colors.primary.default,
    colors.primary.default
  );

  const [{ isDragging: dragIsDragging }, drag] = useDrag({
    type: "LIST_ITEM",
    item: { id, index, level },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  return (
    <div ref={ref}>
      <Flex
        py={1}
        px={3}
        alignItems="center"
        cursor="pointer"
        bg={isSelected ? selectedBg : "transparent"}
        borderLeft={isSelected ? "3px solid" : "none"}
        borderColor={isSelected ? selectedBorderColor : "transparent"}
        opacity={isDragging ? 0.5 : 1}
        transform={isDragging ? "scale(1.02)" : "none"}
        _hover={{
          bg: hoverBg,
          transform: "translateX(2px)",
          boxShadow: "sm",
          backdropFilter: "blur(4px)",
          transition: "all 0.2s ease-in-out",
          "& .menu-icon": {
            opacity: 1,
            transform: "scale(1.1)",
          },
          "& .action-buttons": {
            opacity: 1,
            transform: "translateX(0)",
          },
          "& .menu-indicator": {
            opacity: 0.5,
            width: "3px",
          },
        }}
        transition="all 0.2s ease-out"
        borderRadius="md"
        position="relative"
        role="group"
        my={1}
        onClick={onClick}
      >
        <Box
          position="absolute"
          left="0"
          top="0"
          bottom="0"
          width="0"
          bg={indicatorColor}
          opacity={0}
          transition="all 0.2s ease-in-out"
          className="menu-indicator"
        />

        <Flex width="100%" alignItems="center" gap={2}>
          {icon && (
            <Box
              className="menu-icon"
              opacity={0.7}
              transition="all 0.2s ease-in-out"
            >
              {icon}
            </Box>
          )}

          <Box flex="1">
            <Text fontWeight="medium" fontSize="sm">
              {name}
            </Text>
            {renderDetails && renderDetails()}
          </Box>

          {renderBadges && <Box className="badges">{renderBadges()}</Box>}

          <Flex
            className="action-buttons"
            opacity={0}
            transform="translateX(-10px)"
            transition="all 0.2s ease-in-out"
            ml={2}
          >
            {onEdit && (
              <IconButton
                aria-label="Edit"
                size="sm"
                variant="ghost"
                colorScheme="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <FiEdit2 />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                aria-label="Delete"
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <FiTrash2 />
              </IconButton>
            )}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
