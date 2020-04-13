const covid19ImpactEstimator = (data) => {
  const input = data;
  const impact = {};
  const severeImpact = {};

  const {
    region,
    periodType,
    reportedCases,
    timeToElapse,
    totalHospitalBeds
  } = data;

  const currentlyInfectedByImpact = parseInt(reportedCases * 10, 10);
  const currentlyInfectedBySevereImpact = parseInt(reportedCases * 50, 10);

  impact.currentlyInfected = currentlyInfectedByImpact;
  severeImpact.currentlyInfected = currentlyInfectedBySevereImpact;

  const estimatePeriodType = periodType;
  let duration = timeToElapse;

  switch (estimatePeriodType) {
    case 'weeks':
      duration *= 7;
      break;
    case 'months':
      duration *= 30;
      break;

    default:
      break;
  }
  const factor = Math.floor(duration / 3);

  // estimate infections by Impact and SevereImpact
  const infectionsByRequestedTimeByImpact = Math.floor(currentlyInfectedByImpact * 2 ** factor);
  const infectionsByRequestedTimeBysevereImpact = Math.floor(
    currentlyInfectedBySevereImpact * 2 ** factor
  );

  impact.infectionsByRequestedTime = infectionsByRequestedTimeByImpact;
  severeImpact.infectionsByRequestedTime = infectionsByRequestedTimeBysevereImpact;

  // estimate the number of available hospital beds
  const severeCasesByRequestedTimeByImpact = Math.floor(
    0.15 * infectionsByRequestedTimeByImpact
  );

  const severeCasesByRequestedTimeBySevereImpact = Math.floor(
    0.15 * infectionsByRequestedTimeBysevereImpact
  );

  impact.severeCasesByRequestedTime = severeCasesByRequestedTimeByImpact;
  severeImpact.severeCasesByRequestedTime = severeCasesByRequestedTimeBySevereImpact;

  impact.hospitalBedsByRequestedTime = Math.floor(
    0.35 * totalHospitalBeds - severeCasesByRequestedTimeByImpact
  );
  severeImpact.hospitalBedsByRequestedTime = Math.floor(
    0.35 * totalHospitalBeds - severeCasesByRequestedTimeBySevereImpact
  );

  // estimate the number of ICU cases
  impact.casesForICUByRequestedTime = Math.floor(
    0.05 * infectionsByRequestedTimeByImpact
  );
  severeImpact.casesForICUByRequestedTime = Math.floor(
    0.05 * infectionsByRequestedTimeBysevereImpact
  );

  // estimate the number of cases that need ventilators
  impact.casesForVentilatorsByRequestedTime = Math.floor(
    0.02 * infectionsByRequestedTimeByImpact
  );
  severeImpact.casesForVentilatorsByRequestedTime = Math.floor(
    0.02 * infectionsByRequestedTimeBysevereImpact
  );
  // estimate economic impac
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  impact.dollarsInFlight = Math.floor(
    infectionsByRequestedTimeByImpact * avgDailyIncomePopulation
    * avgDailyIncomeInUSD
    * duration
  );
  severeImpact.dollarsInFlight = Math.floor(
    infectionsByRequestedTimeBysevereImpact
    * avgDailyIncomePopulation
    * avgDailyIncomeInUSD
    * duration
  );
  return {
    data: input,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
