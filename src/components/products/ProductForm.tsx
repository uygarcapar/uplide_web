"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import {
  productCategories,
  productSchema,
  productStatuses,
  type ProductFormValues,
} from "@/lib/validations/productSchema";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/store/slices/productsApi";
import type { ProductRow } from "@/types/database";

type Props = {
  mode: "create" | "update";
  initial?: ProductRow;
  locale: string;
};

function getValidationMessage(t: (key: string) => string, code?: string) {
  if (!code) return undefined;
  if (code === "required") return t("errorRequired");
  if (code === "min0") return t("errorMin0");
  if (code === "integer") return t("errorInteger");
  if (code === "invalidUrl") return t("errorInvalidUrl");
  return code;
}

export function ProductForm({ mode, initial, locale }: Props) {
  const t = useTranslations("products.form");
  const tProducts = useTranslations("products");
  const tStatus = useTranslations("products.status");
  const tValidation = useTranslations("validation");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initial
      ? {
          name_tr: initial.name.tr,
          name_en: initial.name.en,
          description_tr: initial.description?.tr ?? "",
          description_en: initial.description?.en ?? "",
          category: initial.category as ProductFormValues["category"],
          price: initial.price,
          stock: initial.stock,
          status: initial.status as ProductFormValues["status"],
          image_url: initial.image_url ?? "",
        }
      : {
          name_tr: "",
          name_en: "",
          description_tr: "",
          description_en: "",
          category: "other",
          price: 0,
          stock: 0,
          status: "draft",
          image_url: "",
        },
  });

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  async function onSubmit(values: ProductFormValues) {
    setSubmitting(true);
    try {
      const payload = {
        name: { tr: values.name_tr, en: values.name_en },
        description:
          values.description_tr || values.description_en
            ? { tr: values.description_tr ?? "", en: values.description_en ?? "" }
            : null,
        category: values.category,
        price: values.price,
        stock: values.stock,
        status: values.status,
        image_url: values.image_url ? values.image_url : null,
      };
      if (mode === "create") {
        await createProduct(payload).unwrap();
        toast.success(tProducts("created"));
      } else if (initial) {
        await updateProduct({ id: initial.id, patch: payload }).unwrap();
        toast.success(tProducts("updated"));
      }
      router.push(`/${locale}/products`);
      router.refresh();
    } catch {
      toast.error(tCommon("error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label={t("nameTr")}
            error={getValidationMessage(tValidation, errors.name_tr?.message)}
            {...register("name_tr")}
          />
          <Input
            label={t("nameEn")}
            error={getValidationMessage(tValidation, errors.name_en?.message)}
            {...register("name_en")}
          />
          <Textarea
            label={t("descriptionTr")}
            error={getValidationMessage(tValidation, errors.description_tr?.message)}
            {...register("description_tr")}
          />
          <Textarea
            label={t("descriptionEn")}
            error={getValidationMessage(tValidation, errors.description_en?.message)}
            {...register("description_en")}
          />
          <Select
            label={t("category")}
            error={getValidationMessage(tValidation, errors.category?.message)}
            {...register("category")}
          >
            {productCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Select
            label={t("status")}
            error={getValidationMessage(tValidation, errors.status?.message)}
            {...register("status")}
          >
            {productStatuses.map((s) => (
              <option key={s} value={s}>
                {tStatus(s)}
              </option>
            ))}
          </Select>
          <Input
            type="number"
            step="0.01"
            label={t("price")}
            error={getValidationMessage(tValidation, errors.price?.message)}
            {...register("price", { valueAsNumber: true })}
          />
          <Input
            type="number"
            step="1"
            label={t("stock")}
            error={getValidationMessage(tValidation, errors.stock?.message)}
            {...register("stock", { valueAsNumber: true })}
          />
          <div className="md:col-span-2">
            <Input
              type="url"
              label={t("imageUrl")}
              placeholder="https://..."
              error={getValidationMessage(tValidation, errors.image_url?.message)}
              {...register("image_url")}
            />
          </div>
        </CardBody>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Link href="/products">
          <Button type="button" variant="ghost">
            {tCommon("cancel")}
          </Button>
        </Link>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? t("saving")
            : mode === "create"
              ? t("submitCreate")
              : t("submitUpdate")}
        </Button>
      </div>
    </form>
  );
}
