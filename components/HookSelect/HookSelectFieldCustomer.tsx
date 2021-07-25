import React, { FC, useState, useEffect, useCallback } from "react";

import { useForm, FormProvider, useFormContext } from "react-hook-form";

import type { Order, NameValue, Address } from 'src/types/simpleorder';

import { TextField, Grid } from "@material-ui/core";
import Autocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete';

import axios2 from 'src/utils/axios2';

import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { forEach } from "lodash";

interface Customer1 {
  inputValue?: string;
  id: number;
  name: string;
  billTo: Address;
  shipTo: Address;
  salesRep: string;

  PaymentMethod: string;
  PaymentTerm: string;
  FreightTerm: string;
  PriceTerm: string;

  TermsAndCondition: string;
  InternalMemo: string;
}

interface MaterialUISelectFieldProps {
  name: string,
  value: string,
  fields: NameValue[]
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const HookSelectFieldCustomer: FC<MaterialUISelectFieldProps> = ({
  name,
  value,
  fields
}) => {
  const isMountedRef = useIsMountedRef('FormikSelectFieldCustomer');

  const { register, setValue } = useFormContext(); // retrieve all hook methods

  const [customers, setCustomers] = useState<Customer1[]>([]);
  const [options, setOptions] = useState<string[]>([]);

  const getCustomers = useCallback(async () => {
    try {
      const response = await axios2.get<Customer1[]>('/customer/list?type=raw');
      //console.log('getCustomers response.data', response.data);

      if (isMountedRef.current) {
        setCustomers(response.data);
        setOptions(response.data.map(a => a.name));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  return (
    <>
      {/*
       <input name="billTo.address1" type="hidden" ref={register} />
       */}
      <Autocomplete
        id={name}
        //style={{ width: 570 }}

        value={value}

        options={options}

        getOptionSelected={(option, value) => option === value}

        getOptionLabel={(option) => option}

        renderInput={(params) =>
          <TextField
            {...params}
            label="Customer"
            variant="outlined"
            //autoFocus
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />}

        renderOption={(option) => {
          return (
            <Grid container alignItems="center">
              <Grid item>
                {option}
              </Grid>
            </Grid>
          );
        }}

        onChange={React.useCallback(
          (event: any, newValue: string | null) => {
            //console.log('event', event);
            //console.log('name', name);
            //console.log('newValue', newValue);
            //console.log('customers', customers);
            //console.log('options', options);

            if (newValue == null) {
              fields.forEach(u => {
                setValue(u.name, null);
              });
              return;
            }

            var selectedCustomer = customers.filter(u => u.name == newValue)[0];
            //console.log('selectedCustomer', selectedCustomer);
            fields.forEach(u => {
              console.log('selectedOption[' + u.value + ']', selectedCustomer[u.value])

              // selectedCustomer.billto에서 default가 true인 녀석을 골라서 한넘만 setField를 해준다
              //console.log(u.name);
              if (u.name == 'billTo') {
                //debugger
                setValue(u.name, selectedCustomer[u.value][0]);
              }
              else { // else or shipto 이면 // 기존소스 그대로 ㄱㄱ
                setValue(u.name, selectedCustomer[u.value]);
              }
            });
          },
          [customers, options]
        )}
      />
    </>
  )
};

export default HookSelectFieldCustomer;
