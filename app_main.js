console.log('Jeffrey in the House...');
async function fetchData(vfile){
  try {
    const response = await fetch(vfile);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    CLIENTNAME=data.clientname;
    TELNO=data.telno;
    document.title=CLIENTNAME;
    div_clientname.textContent=CLIENTNAME;
    about_clientname.textContent=CLIENTNAME;
    footer_clientname.textContent=data.full_clientname;
    biz_address.textContent=data.address;
    biz_tel.textContent=data.telephones;
    biz_email.textContent=data.email;

    // Coordinate variables
    const latitude = data.coordinates[0];
    const longitude = data.coordinates[1];
    const plusCode = "JXR6+M4W";
    const zoomLevel = 16;
    
    updateMap(latitude, longitude,'JXR6+M4W, Alijis, Bacolod, 6100 Negros Occidental, Philippines');

    PAGE_USERNAME=data.messenger;
    // Build the link URL
    const linkUrl = `https://m.me/${PAGE_USERNAME}`;
    // Assign to href
    document.getElementById("messengerLink").href = linkUrl;
    document.documentElement.style.setProperty('--accent', data.app_color); // changes to red
    return data;
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}

function updateMap(lat, lng, name = "Location", zoom = 16) {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(name)}%40${lat},${lng}&z=${zoom}&output=embed&t=m`;
  document.getElementById("mapFrame").src = mapUrl;
}

async function get_stock(vfile) {
  try {
    const response = await fetch(vfile);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const prod = Array.isArray(data) ? data : [];
    renderProducts(prod);
    return data;
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}
// Call the function
//fetchData();

function callText(m){
  //alert(m);
  callTextGO(m,TELNO);
}

function callTextGO(m,celno){  
  //alert(m+' vs '+celno);  
  if(celno.substring(0,1)=='0'){
    celno='+63'+celno.substring(1);
  }
  
  var vhref='';
  if(m=='call') {      
    //window.location.href="tel:+63-948-952-3337";
    vhref='tel:'+celno;
  }else if(m=='text') {
    //window.location.href="sms://+639489523337?body=I%27m%20interested%20in%20your%20product.%20Please%20contact%20me."
    vhref='sms://'+celno+'?body=I%27m%20interested%20in%20your%20product.%20Please%20contact%20me.';
  }  
  window.location.href=vhref;
  //window.location.href="sms://+639489523337?body=I%27m%20interested%20in%20your%20product.%20Please%20contact%20me."
}