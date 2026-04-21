import './AboutUs.css';

export const AboutUs = () => {
  return (
    <main className="about-us">
      <section className="about-hero">
        {/* Desktop only overlay, gradiant left-->right */}
        <div className="about-hero__overlay" aria-hidden="true" />
        <div className="about-hero__mobile-img" aria-hidden="true" />
        <div className="about-hero__content">
          <h1 className="about-hero__headline">About Hybrid Hiring Solutions</h1>
          <p className="about-hero__body about-hero__body--desktop">
            Hybrid Hiring Solutions is a staffing company located in NE Pennsylvania that provides a
            personalized experience to search and source candidates for job openings clients have.
            The organization largely supports clients in the gas and energy industry that have jobs
            in Northeastern Pennsylvania as well as globally. The jobs Hybrid Hiring Solutions
            focuses often require specialized skills such as chemists, equipment operators, and
            financial analysts.
          </p>
          <p className="about-hero__body about-hero__body--mobile">
            Hybrid Hiring Solutions is a staffing company located in NE Pennsylvania that provides a{' '}
            <strong className="about-hero__emphasis">personalized experience </strong>
            to search and source candidates for job openings clients have.
          </p>
          <p className="about-hero__body about-hero__body--mobile">
            {' '}
            The organization largely supports clients in the gas and energy industry that have jobs
            in Northeastern Pennsylvania as well as globally.
          </p>
          <p className="about-hero__body about-hero__body--mobile">
            The jobs Hybrid Hiring Solutions focuses often require specialized skills such as
            chemists, equipment operators, and financial analysts.
          </p>
        </div>
      </section>
    </main>
  );
};
