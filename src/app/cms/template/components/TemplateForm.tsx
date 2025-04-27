"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  Input,
  Select as ChakraSelect,
  Switch as ChakraSwitch,
} from "@chakra-ui/react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Template } from "@/types/template";

const createTemplateSchema = (template?: Template) =>
  z.object({
    templateName: z.string().min(1, "Template name is required"),
    templateType: z.enum(["PAGE", "COMPONENT"]),
    layout: z.array(z.any()),
    published: z.boolean(),
  });

type TemplateFormData = z.infer<ReturnType<typeof createTemplateSchema>>;

interface TemplateFormProps {
  template?: Template;
  onClose: () => void;
  onSubmit: (
    data: Omit<Template, "templateId" | "createdAt" | "updatedAt">
  ) => void;
}

export function TemplateForm({
  template,
  onClose,
  onSubmit,
}: TemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(createTemplateSchema(template)),
  });

  useEffect(() => {
    if (template) {
      reset({
        templateName: template.templateName,
        templateType: template.templateType as "PAGE" | "COMPONENT",
        layout: template.layout,
        published: template.published,
      });
    } else {
      reset({
        templateName: "",
        templateType: "PAGE",
        layout: [],
        published: false,
      });
    }
  }, [template, reset]);

  const handleFormSubmit: SubmitHandler<TemplateFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <VStack gap={3} align="stretch">
          <Box>
            <Text mb="2">Template Name</Text>
            <Input
              {...register("templateName")}
              placeholder="Enter template name"
              _invalid={{ borderColor: "red.500" }}
            />
            {errors.templateName && (
              <Text color="red.500">{errors.templateName.message}</Text>
            )}
          </Box>

          <Box>
            <Text mb="2">Template Type</Text>
            <Controller
              name="templateType"
              control={control}
              render={({ field }) => (
                <select {...field}>
                  <option value="PAGE">Page</option>
                  <option value="COMPONENT">Component</option>
                </select>
              )}
            />
            {errors.templateType && (
              <Text color="red.500">{errors.templateType.message}</Text>
            )}
          </Box>

          <Box>
            <Text mb="2">Published</Text>
            <Controller
              name="published"
              control={control}
              render={({ field: { value, ...field } }) => (
                <ChakraSwitch.Root {...field} checked={value}>
                  <ChakraSwitch.Control>
                    <ChakraSwitch.Thumb />
                  </ChakraSwitch.Control>
                </ChakraSwitch.Root>
              )}
            />
          </Box>

          <Button
            type="submit"
            colorScheme="blue"
            loading={isSubmitting}
            loadingText="Submitting..."
          >
            {template ? "Update Template" : "Create Template"}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
