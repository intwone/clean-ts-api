export const map = (surveys: any): any => {
  if (!surveys) return [];
  if (!Array.isArray(surveys)) {
    const { _id, ...surveysWithoutId } = surveys;
    return { ...surveysWithoutId, id: _id };
  }
  const mappedSurveys = surveys.map((survey: any) => {
    const { _id, ...surveysWithoutId } = survey;
    return { ...surveysWithoutId, id: _id };
  });
  return mappedSurveys;
};
