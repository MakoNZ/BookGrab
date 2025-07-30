export const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const getServerEnvVariables = () => {
  return {
    MAM_TOKEN: getEnvVariable("MAM_TOKEN"),
    QB_HOST: getEnvVariable("QB_HOST"),
    QB_USERNAME: getEnvVariable("QB_USERNAME"),
    QB_PASSWORD: getEnvVariable("QB_PASSWORD"),
    AUDIOBOOK_DESTINATION_PATH: getEnvVariable("AUDIOBOOK_DESTINATION_PATH"),
    EBOOK_DESTINATION_PATH: getEnvVariable("EBOOK_DESTINATION_PATH"),
  };
};
