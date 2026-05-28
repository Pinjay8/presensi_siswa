/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  SelectTrigger,
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/core/libs';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { lang, simpleDecode } from '@/core/libs';
import { useAlert } from '@/features/_global/hooks';
import { useUserCreation, useUserDetail } from '../hooks';
import { userUpdateSchema } from '../utils';
import { useEffect } from 'react';

// **✅ Perbaiki tipe signature dalam model**
interface UserCreationModel {
  name: string;
  isActive: number;
  signature?: string | null; // Dapat berupa string atau null
}

const statusOptions = [
  { label: lang.text('active'), value: '2' },
  { label: lang.text('nonActive'), value: '1' },
];

export const AdminCreationForm = () => {
  // ✅ Perbaiki penggunaan ref dengan `useRef`
  const params = useParams();
  const navigate = useNavigate();
  const alert = useAlert();

  const decodeParams: { id: number | string; text: string } = params.id
    ? JSON.parse(simpleDecode(params.id || ''))
    : {};

  const detail = useUserDetail(Number(decodeParams?.id));
  const creation = useUserCreation();

  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    mode: 'all',
    defaultValues: {
      name: detail.data?.name || '',
      isActive: detail.data?.isActive === 2 ? '2' : '1',
    },
  });

  useEffect(() => {
    if (detail.data) {
      form.reset({
        name: detail.data.name || '',
        isActive: detail.data.isActive === 2 ? '2' : '1',
      });
    }
  }, [detail.data, form]);

  async function onSubmit(data: z.infer<typeof userUpdateSchema>) {
    try {
      // ✅ Gunakan null-safe operator untuk menghindari error

      const payload: UserCreationModel = {
        name: data.name,
        isActive: Number(data.isActive),
      };

      console.log('Payload yang dikirim:', payload); // Debugging payload sebelum dikirim

      await creation.update(Number(decodeParams.id), payload);

      alert.success(
        lang.text('successUpdate', { context: lang.text('userAdmin') }),
      );

      navigate(-1);
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text('failUpdate', { context: lang.text('userAdmin') }),
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
        <div className="max-w-lg gap-6">
          <div className="basis-1">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="basis-1 sm:basis-1/2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{lang.text('adminName')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={lang.text('inputAdminName')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="basis-1 sm:basis-1/2">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>{lang.text('status')}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={lang.text('selectLevel')}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((option, i) => (
                            <SelectItem key={i} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Form Tanda Tangan */}

            <div className="py-4">
              <Button disabled={creation.isLoading} type="submit">
                {creation.isLoading
                  ? lang.text('saving')
                  : lang.text('saveChanges')}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
