import { Metadata } from 'next';
import { useTranslation } from 'react-i18next';

const { t } = useTranslation("pages.home.meta");

export const metadata: Metadata = {
    title: t("title"),
    description: t("description"),
}; 