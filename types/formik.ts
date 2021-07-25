import { ReactNode } from "react";
import { FieldInputProps } from "formik";

export interface FormikSelectItem<T> {
  label: string;
  value: T;
}

export interface FormikSelectProps<T> {
  name: string;
  items: FormikSelectItem<T>[];
  label: string;
  required?: boolean;
  value: T;
}

export interface MaterialUISelectFieldProps<T> extends FieldInputProps<T> {
  errorString?: string;
  children: ReactNode;
  label: string;
  required: boolean;
  value: T;
}