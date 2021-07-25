import React, { useState } from 'react';
import type { FC } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    FormHelperText,
    makeStyles
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

interface MsalLoginProps {
    className?: string;
}

const useStyles = makeStyles(() => ({
    root: {}
}));

const MsalLogin: FC<MsalLoginProps> = ({ className, ...rest }) => {
    const classes = useStyles();
    const { loginPopup } = useAuth() as any;
    const [error, setError] = useState<string | null>(null);
    const isMountedRef = useIsMountedRef();

    const handleLogin = async (): Promise<void> => {
        try {
            console.log("handleLogin start");
            await loginPopup();
            console.log("handleLogin end");
        } catch (err) {
            console.error(err);
            if (isMountedRef.current) {
                setError(err.message);
            }
        }
    };

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            {error && (
                <Box my={3}>
                    <FormHelperText error>
                        {error}
                    </FormHelperText>
                </Box>
            )}
            <Box
                display="flex"
                justifyContent="center"
            >
                <Button
                    onClick={handleLogin}
                    variant="contained"
                    color="secondary"
                >
                    Log in with Msal
        </Button>
            </Box>
        </div>
    );
};

MsalLogin.propTypes = {
    className: PropTypes.string
};

export default MsalLogin;
