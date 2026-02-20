export default async function handler(req, res) {

  // CORS (safe for production + dev)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Debug (you can remove later)
    console.log("STRAPI TOKEN EXISTS:", !!process.env.STRAPI_TOKEN);

    const response = await fetch(
      "https://cms.vitap.ac.in/api/faculty-profiles?fields[0]=Name&fields[1]=Designation&fields[2]=Office_Address&fields[3]=EMAIL&fields[4]=Department&populate[Photo][fields][0]=url&sort=Employee_Id:ASC",
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CMS ERROR:", errorText);

      return res.status(response.status).json({
        error: "Failed to fetch from CMS",
        details: errorText
      });
    }

    const data = await response.json();

    const simplified = data.data.map(item => ({
      id: item.id,
      name: item.attributes.Name,
      designation: item.attributes.Designation,
      office: item.attributes.Office_Address,
      email: item.attributes.EMAIL,
      department: item.attributes.Department,
      photo_url:
        item.attributes.Photo?.data?.attributes?.url || null
    }));

    // 🔥 Vercel Edge Cache
    res.setHeader(
      "Cache-Control",
      "s-maxage=600, stale-while-revalidate"
    );

    return res.status(200).json(simplified);

  } catch (error) {
    console.error("Serverless Error:", error);

    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}