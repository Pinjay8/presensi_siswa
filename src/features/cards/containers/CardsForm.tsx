/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/core/libs";

import { lang, simpleDecode } from "@/core/libs";
import { useAlert } from "@/features/_global/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useCardCreation } from "../hooks/useCardCreation";
import { useCards } from "../hooks/useCards";
import { useCardById } from "../hooks/useCardsById";

const cardCreateSchema = z.object({
  nomorKartu: z.string().min(1, "Nomor kartu wajib diisi"),
});

export const CardsForm = ({
  onClose,
  cardId,
}: {
  onClose: () => void;
  cardId?: number;
}) => {
  const params = useParams();

  const detail = useCardById(cardId);

  const creation = useCardCreation();
  const resource = useCards();
  const alert = useAlert();

  const isEdit = Boolean(detail?.data?.id);

  const form = useForm<z.infer<typeof cardCreateSchema>>({
    resolver: zodResolver(cardCreateSchema),
    values: {
      nomorKartu: detail?.data?.nomorKartu || "",
    },
  });

  async function onSubmit(data: z.infer<typeof cardCreateSchema>) {
    try {
      if (isEdit) {
        await creation.update(Number(cardId), data);
      } else {
        await creation.create(data);
      }

      alert.success(
        isEdit
          ? lang.text("successUpdate", {
              context: lang.text("cards"),
            })
          : lang.text("successCreate", {
              context: lang.text("cards"),
            }),
      );

      await resource.query.refetch();

      onClose();
    } catch (err: any) {
      alert.error(
        err?.message ||
          (isEdit
            ? lang.text("failUpdate", {
                context: lang.text("cards"),
              })
            : lang.text("failCreate", {
                context: lang.text("cards"),
              })),
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nomorKartu"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{lang.text("numberCards")}</FormLabel>

              <FormControl>
                <Input
                  placeholder={lang.text("cardMust10Numbers")}
                  {...field}
                />
              </FormControl>

              <FormMessage>{fieldState.error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={creation.isLoading || !form.formState.isValid}
        >
          {creation.isLoading ? lang.text("saving") : lang.text("saveChanges")}
        </Button>
      </form>
    </Form>
  );
};
