"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Rocket, ShieldCheck, Zap, 
  MessageSquare, Phone, Laptop, Tablet, Smartphone 
} from "lucide-react";
import Navigation from "../components/Navigation";
import StatsGrid from "../components/StatsGrid";
import PlannerDemo from "../components/PlannerDemo";
import ProjectsShowcase from "../components/ProjectsShowcase";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";

// מערך לוגואים לסרט הנע
const techLogos = [
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Gemini AI", src: "https://www.wespeakiot.com/wp-content/uploads/2025/08/google-gemini-new-rainbow-colours-1120w630h-960x630.webp" },
  { name: "ChatGPT", src: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { name: "Copilot", src: "https://adoption.microsoft.com/wp-content/uploads/2025/04/copilot_preview.jpg },
  { name: "Firebase", src: "https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg" },
  { name: "Vercel", src: "https://www.svgrepo.com/show/342111/vercel.svg" },
  { name: "Google Sheets", src: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" },
  { name: "Apps Script", src: "hdata:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMREhMSExMVFRUVGRsYGBcVGBgWGBYZFxcXGBoXGhUYHSkhGBolGxgZITEhJSotLjIuGB8zODMtNygtLjcBCgoKDg0OGxAQGysmHyYtLzUtLS0tLy8tLS0tLS0tLy8vLS8tLSstMC0rLS0tLTUuLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAwEBAQEBAAAAAAAAAAAABAUGBwMCCAH/xABIEAABAwIDBAYECgkCBgMAAAABAAIDBBEFEiEGEzFBIlFhcYGRBxQyoTRScnOSsbKz0dIVFhczQmKCouEjUyRUwcLw8UNjk//EABsBAQACAwEBAAAAAAAAAAAAAAADBAECBQYH/8QAOREAAgEDAQQGCAQHAQEAAAAAAAECAwQRIQUSMUETUWFxkbEUIjOBodHh8BUycsEGFiM0QlLxU0P/2gAMAwEAAhEDEQA/AO4oAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAhV+KwQfvZWMPUTr9Hit4U5z/KjWU4x4shR7V0bjbftHeHNHmRZSO2qrka9NDrLeGVrwHNcHNPAtIIPiFC01ozdPJ9rBkIAgCAIAgCAIAgCA8p6pjLZ3tbfhmcBfuusOSXE1lOMeLwfbHhwBBBB4Eag+KyZTT1R9IZCAIAgCAIAgCAIAgCAIAgMhtrtOYP9CE/6hF3O+IDwA/mPuHerltb7/rS4FetV3dEU2DbFy1A3s7ywO1selI6/M39nxuVPUu4w9WKz5EcKDlrItp/R9EW9CWQO63Brh5AD61Cr6WdUjd2y5M8dmNnaumqSM4bENXEatk6gGnge3l2ravXpzhw18hTpzjLsNwqBZCAIAgCAIAgCAIAgMV6R/wD4P6/+xU7vkcvaX+Pv/Y0mzvwWD5tv1KxS/Iu4vW3so9xYqQmCAIAgCAIAgCAIAgCAID5e6wJPAC/kiBy3ZeH1yuzya6ulcDrexFh3AlvgF1q76KlhdxRpLfnlnVFyS8Q6nFII3ZXyxtd1OcAdewreNOcllI1c4rizy/TtN/zEX02/is9DU/1ZjpI9ZKpK2OUExva8DQlpBt5LWUJR4o2Uk+Bjse9IkcTjHAzelpsXk5WX/ltcu9w7Sqk7hJ4R3bXYs6kd6q93s5/Qr6T0mPDrTU4y8924hw/pdofMLVXL5osVNhRa/pz17Vp8DfYZiMdRG2WJ2ZrvMHmCORHUrMZKSyjgVqM6M3CawzyxHFGxaWzO6hy7zyXNv9qUrX1cZl1fNm9G3lU14IrRtC/4jbd5+tchfxFVzl01jvfyLXoMestqDEGzDTQji08R+IXdstoUruPqaNcU+JTq0JU3rwPPGcXjpY95IexrRq5x6gF0qdKVR4RWnNRWWY2X0hSX6MDA3tcSfMCwV1WMcasr+kvqJM3pDaGtLYCSQcwL7ZT2HKcwPgtVYvOrMu57B6QJMzaZ3C4cfMMK4t4sNLvKm0f8ff8AsaHCqtkNFFJI4NY2NpJPLQefcpqbSppvqOlZU5VIQhBZbSMhW+ktxcRBAC3kZCcx7creHmVC7nXRHpqewoqOak9ezh4stdmtvI6l4ilZupHaNIN2OPVc6td2e9b066k8Mq3myJ0Y79N7y59ZsVYOMEAQBAEAQBAEAQBAfErMzS3rBHmsp4eQzmOxEvq9bkfoSHRHsdcG3my3iurdLfpZXeUaL3Z4Z1FckvGWx/Y8VUxm32S4AtlvwFuN1bo3XRx3cEE6O885M/jmxzaaF8xnvltZuS1ySBa+ZWaV06klHBFOioxzkiUFS+DDap7SQZHtjBHaBmt4EqntSeEsHU2FRVS4W9wWvh9Sx9GGBxuY6pe0OdmLWXFw0NAuQOsk2v2dq5tvBY3mdnbV3NSVGLwsZfaa7aDA4quJzHtGaxyPt0mO5EH6xzU84KSwzkWl3Ut6ilF6c11owfotrnMmmhPsuYX25ZmEC/iHW8AqlCe7nuO9tukpUo1Oece5mowmHfykv14uPab6Du/BeX2ZRV7dOVXXm+18l3fI5txPoqeI9xpnwtIyloI6raL2UqNOUdyUVjqOWpSTymZnLuKkBvAOA8HW09/uXjt30LaKjDhleEsae7PwOpnpaGX1eRm9rZHVOICG9gHMib2ZsuY267u9wX0q3ShR3u9nnKr3qmDodDh0ULBHGxrWjs49pPMrmynKTy2W4xSWEc62/wAJZBK10YDWygnKNAHNtew5A5hp3rpWlRzjh8ipXgovQtNuf3dJ8k/UxcC9/MveV9o8Ie/9ip24rCKOhhHBzM57cgaAP7iVHUf9OKPX/wAM0k6bqc0kvH/hIwraOiw6BrYm76dzQZHNFhmIvYyO5C9rC/ndbxqQpx01Zar2V1eVW5vdjyXZ3dvbgq5cLrMTm37adsINunrG3Tg656T3fzAcgo92dR5xgtRuLaxp9G5uXZxfyXc2dWoWPbGxsjg54aA5wFg5wGpA5XKvLONTylVxc24LCzouw91k0CAIAgCAIAgCAIAgMJtzs67MaqEE85Gt4gj+MW9/n1roWtdY3Je4q1qTzvI/uBbdgNDKkG403jRe/wApvX2jyWKtm85h4CFxykXEu2tGBcSOceoMff8AuAChVpV6iR14GQxnGJsSlZFEwhoPRZxN+Gd54ADyCuU6UaEd6TK85uo8I1WI7MXw51KzV4GYHhmkBzeFzouVdN1ss6+zaqtq0ZPhz95kthNqW0eenqMzWFxINiTG7g5rm8baeBuqVGqoerI9DtPZ8rjFWlq8eK5YNFtDt3TsicKd+8lcLNsDlbf+IkjW3UFLUrxS9Xic602RWlNOqsRXiyr9FmEOvJUuByubu2X/AIrkF57tAL9d+pR29POWyztu5Xq0Y8eL7OovIHmlmIIuOHe08CP/ADrXlKM57Mu2pLTh3x5NffWipJK4p6fbLp+MwgXzX7ADdejltm0UN5Sz2YefvvKCtareMFPRNdUT5yNAQ49gHAe4e9eftIzvr7pWtE8vsxwXwXxLtVqjR3TP7c0T4KptUwaOLXA8hIy2h78oPmvo9rNTp7j+0eerxcZbyNLQ7Z0r2Bz37t1tWuDjY9hA1CqytKieEsk0a8GtTEbX44KuUFoIYwENvxN9S4jlew8lft6PRx14larU33oX+3P7uk+SfqYvO3v5l7yHaPCHv/YibXYU6XD6WdguYWDMBxyOAu7wIF+y/UtZwzSi1yPU/wAOXCglTl/kljvRE2GxHDo2jfMaycH23gvaRyLeIYfLgsUZU0teJ1Np0L2cv6bzDqWnj1l3i3pEhjexsLTM2/TcLt05Blx0j7lLK4SempSobFqzi3Ue6+X16jZwSZmtdYjMAbOFnC4vYjkVYRxpR3W0faGoQBAEAQBAEAQBAEAQFLiey1LOS50eVx4uYcpPeOB8lPC5qQ0TI5UoyK6PYGmBuXSkdRc23uaCpHe1Ow09HiX+HYZDTtyxMDBztxPe46lV51JTeZMljBR4ExaGxR43spTVZzSMLX/HYcrj38j4gqOdKMuJetto17dYi9Op8CvovR9RxuzO3kvZI4ZfJoF/FaK3gixU2zczWFhdy+eTVRsDQAAABoANAB1AKc5TbbyzyqqRkgs8X6usdxVe4tKNxHdqxz5+JvTqSg8xZBGARX4v7rj8Fy1sC2TzmXdlfLJP6bU7CxggawZWgAdi69GhTox3KawitOcpvMmVO0OM0sQ3VR0s4F2Zc3RJtc8gNPcrlGlUl60CGpOK0kVx2GpH2e10gadQGuBbY9RLSbeKl9MqLR4NOgg9UZfbKmhZNHT07R0G2NtSXvPAnmeHmrVtKTi5zIKySajE6BXYHFO2NsoJ3YsLOI5AHh3LjVKcajyyxVt4Vcb3InU1O2NjY2jotGUA66Dv4rZJJYRJCKgklyM5iWwVHM4uAfETqd0QAf6XAgeFlFKhBnWo7Xuaaw2n3/aJGDbHUtK4PawveODpDmI7hYAHtsswoxjqiO42ncV1uyeF1L7yaBSnPCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgKfaTAGVjACcr2+w+17dYI5gqejWdJ9hHUpqaMczZjEYrsjeQ3+SUtb5G31K56RQlq18Cv0VRaIuNmNjTC8TTua57dWtbcgH4xJ4n/wA1UNe63lux4ElOhuvMjYqkWAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgM7jG2VPTyGIh73N9rIBZp42u4i57lq5JFGttClSlu6t9n2iB+0On/wBqbyZ+dY30Q/itL/WXw+Y/aHT/AO1N5M/Om+h+K0v9ZfD5j9odP/tTeTPzpvofitL/AFl8PmW2BbTRVZIaHsI06eUX7rErKkmWbe8hW4JrvLtbFsIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgOJ42f+JqPnpPvHKB8Tylf2s/1PzZCWCIIAgNDsubNf8AKH1LeJdtODOhYLiu86D/AGxwPxv8qRM7VCvvaPiWyyWQgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgOJY18JqPnpfvHKB8Tydb2s/1PzZDWCMIAgNDswei/vH1LaJdteDLoG2o4hbFo1ODYrvBkfo8f3f57FumdGhW39HxLVZLAQBAEAQBAEAQBAEBk9tdopIXMpqcXnl58cgJsLA6XNjx4AFYb5IpXVeUWqcPzMom7Ivf05qpxkOvN1j8ouufcsbjIPQJS1nPUlYZitRQTMgqX7yGTRrySS3gL3OthpcHruFjLT1MQqVbaooVHmL5m/W51TG4ltBNPI6Kl6LW6GTr5aHkOq2pXVp2tKjBTr8XyKM606kt2n4nwIa2PptnL7cWkk+52hWOmtZvdcMdv/DPR146qWTQYBi4qGG4yvb7Q/6jsVS5t+ilpwfAno1ekWvEtVWJggCAIAgOJY18JqPnpfvHKB8Tydb2s/1PzZDWCMIAgPalq3xG7DY+YPeFlM3hNweUez9opx8T6P8AlbZJ1cSZ/G7TVA1BYCOBDT+KZM9PNHYsHqHSQQyO9p8bHG2mrmgnTvUqPQ0pOUIt80iYhIEAQBAEAQBAEAQHOsU6OMkv/iYMl/kW08nBIfmOc8K716tPD/ppN2HC6kzhl8zO38jfV42n2s/R7g05vCxC0qI5+0t3okn1l+/Hr4a2e/TewM/rPRPkQT4KxZUulqpcufuJenzbqfPHxKzZNjREO0m/eOHusre0W+k9xmzS6MugCHBc/ii0QcEuMQlDfZy3PYSGk/3K5U1tY5++JXj7Z4NeueWggCAIAgOJY18JqPnpfvHKB8Tydb2s/wBT82Q1gjCAIAgPl7QeKGU8EWRllsSJ5O67O/Bab5qP7DVKuB6ah7KPcvIsFklINXjFPC7JLPDG618r5GNNjwNnG9kB+XfSJj036SrNzUybvenLu5XZLaezlNrdyA/QWxW0VMMPot5Vw5/V4s2eZmbNu23zXde9+N0BrkAQEDFK/d2a3V7uHZ2rmbRvnbpQprM3w+/IsUKO/rLgiutIdXSEHvP/AEVJbNvanrVKzT6k3+zS8CV16UdIxJFPXuYbP6Q6+f8AlYje3FjNU7n1ovg/vj79Q6UKqzT0fUZT0oU9xT1TDwJYXD6TTflYh3mu5CpCpFTg8o4W0abi4y5mfh2vna0AtY8/GNwfEDQ+5Sqq+BUV/Ujo0mU9fXyVD88hueAA0DR1ALSUslSrVlVe9IsqWreYGwk9Br3PHe4Ae6x+kV3Nk0sQdR8+Hcvr5ElOUtzd5ZLigq3QjSx6wevv5KzXoqrxLlKq6ZO/WRztGx2d1uN7eHNU1YJP1noWXdaaI0GxtJZj5nauebXPMDifO/koL6ayoLgje2jo5PmaNUC0EAQBAEBxLGvhNR89L945QPieTre1n+p+bPvAaFtRURQuJDXkgltrizSdLgjkiWWbW9NVKsYPmaqp2Xw6NxY+se1w4tdJECLi/DJ1LfdidCdnawe7Ko0+9fI9Ydj6B7HStqpHMbfM4PiLRYXNzk00TdRtGwtpRclN4XPK+RGGz2GHQVrv/wBIvyJuxI1a2b/+vxXyKnbDA46OSNkbnuDmknOWk6G2mUBayWCveW0aEkotvPWZ57bjValPODtuAttTU46omD+wKdcD1dD2Ue5eROWSU/PPp2wKqnxIPhpp5WblgzRxPe24L7jM0EX1QHJ6mnfG5zJGOY9ps5rwWuaeotOoKAsYNmK17WvZR1LmuALXNhkLXA6gghtiCOaA/ZqAIDPYk61Tr1C3l+N1w2k9qLe6tPB/vkvL+1ePvUbvNqvQ72NDn4IuIyWaLcQf/a4+24xdst7jlY+P7F2wWajXLBWY43fUsrBxtmt2sOYfVbxXndn3E6FdLPqt69RLtG26ShJc0sr3anO4ivXs8PLrPrKspOTwjCLqii1A6l66EFSpqC5ItQjyJrysIkZ60cRcQANXGw8dAtKkktWbRWTp1HTiNjWDg0AfifNedqTc5OTOvGO6kj2WhsEAQBAEBxLGvhNR89L945QPieTre1n+p+bJuxvw2n+UfsOWY8Say/uIffJmi2lo6B1TIZqiVkhtma1twOiLWOQ8rc1s0sl26p2zqtzm0/p3FjhFNSChqGxzPdCc2d5FnN6IvYZeq3JZWME9GFBW81GT3dcv3dxnYqDDMwtVTXuLdHnf5C1xEpRpWmVib8PoSfSf++h+QftJM32r+ePcYwrQ5Z23Bfg8HzbPshTrgero+zj3ImLJKEB+eNu/RfidViFVPFC0xySFzSZGC401sTcIDuGyFE+ChpIZBlkigiY8XBs5rGgi40OoQFugCArsXw7egOabPbw7exc6/snXSnB4muH35Fm3r9HpLgzOy1L4yWubqOOtvcqi21Wp+pVh6y93zLKsac/WhLQ8nPL9Vxry9q3M8z5cFyRapUY0ViJ9NbZUsm7eTnVbBupns+K4jwOo9xC9tb1eloxn1r/vxPA3dHoqs6fU/qvgfdKy7u5dbZlHfrbz4R1+RXprLLulbYX616Cb1wW4rQ+narBk0eyVHnmDuUYv48B+Pgufe1N2njrLVtDMs9RuFxjohAEAQBAEBxLGvhNR89L945QPieTre1n+p+bJuxvw2n+UfsOWY8Say/uIffJmi2lrMPbUyCaCV8gtmc11geiLWGccrcls2sl26qWyqtTi2+/s7yxwiopDQ1Do4nthGbOwm7ndEXscx5W5rKxgnozoO3m4xe7rle7vM7FX4XmFqWa9xbp87/OLXMSjGrZ5WIPx+pJ9J/76H5B+0kyTav549xjCtDlnbcF+DwfNs+yFOuB6uj7OPciYskoQBAEAQETE8Sjp255HWHIcS49QHNayklxJ7e2qV5btNZM+7bZmpELy3ruB+Kj6ZdR1FsWfBzWSFXbVwzCzoXX5EOFx7vcqt1RpXEcTWvJ80WKWyKtN5U14EOiq2v8AZOvMHivM3NrOi8S4cmb1qMqf5ixY4FUmsFZox22lLllbIOD22Pe3/BHkvS7Frb1J03yfwf1PL7bo7tVVFzXxX0IdBHcDrcvd7NpdHQ3nz19xyKcS8kpnsaLscB1kEBWI1ISejRZcJJao8oRcreXA1R0DZWkyQhx4vObw4D8fFcK9qb1THUdS3huwz1lyqhOEAQBAEAQHEsa+E1Hz0v3jlA+J5Ot7Wf6n5s+sErhTzxzFpcGEmw0Ju0jj4onhmaFRU6im+Rq5dtqZxLnUYcTxJyEnxIW++uo6T2jRby6fkfTNuoGtLBSWaeLQWAHvFrFN9GVtKklhQ09x5jbKl/5JvlH+VN5dRr+IUf8Az8ik2rx0Vj2PDCzK0tsSDe5vyWsnkqXlyq8k0sYKMrUqHbcF+DwfNs+yFOuB6uj7OPciYskoQBAEAQHP5D67iEwfrHBdoby6Jy28XXJ7lXXr1HnkeknJ2Wz4OGkp8+/Xy0L9r76AAN4W/wAK5upI805NvLMJtrTCGVjmdFslwQOAc23lcH3dqpXMN1prmew2DdOvTlTqauOMPnh/L9yjZK8G4cQRzCqyipLEuB3JQhJYaNHhWN5rNk6LuR5H8CuLdWDh60NV1czjXVg4etT1XVzR77Tw72DtY4EdxOU+438FnYzxdxhylp8jy+2KG/btr/F5/Z/AlbI0bcue2t8o7AAOHb+C+h7QqbuKa4JHFs6axvGkza2OoOllzMc0XjMOoh62adumYgt7nC58tfJdenXbodJLkc+dLFTdR0WNgaA0aACw7guK228s6KWND6WDIQBAEAQBAcTxsf8AE1Hz0n3jlA+J5Sv7Wfe/MhLBEEAQBAEB/CgO3YOLU8I/+tn2Qp1wPWUfZx7kTFkkCAIAgCA5njUjsNxB8zmncVFzmAvYnV39QcL26iqrl0VTL4M9XRpLaezlSg/6kOXwXua071qXkeO0+TOJosvXnaLd4J0PYre/BrO8sHnJWNzGe46cs9WGc/2tx+OpkaGElkd7Ot7Tja5HZoPeqNxXjUaS4I9jsXZdS1puVT80uXUl++pXw1zALG/koVJHXdCfI9PX4+3yWd5GvQVCxo9o2NBY8ucwi3DUA/WFTqW6VSNalpKLT7G08nOvNkOvFpYTa8S72exVsYIvdhNw5uuvDgNbaL29VRu6ca1PmuH7d6Pmzp1LOrKhWWGn9vuZfvxyC2bO13Y3Unw5eKoxtaj0wTOrBa5PTZWmdLM+reLA9FnuGncBa/aVLcuNOmqMfeR0U5Sc2a1c8tBAEAQBAEAQFFiuydNUPMj2ua88Sx1s3K5HC61cUypWsaVWW81r2EL9QaXrl+kPyrG4iH8Mo9viP1BpeuX6Q/Km4h+GUe3xH6g0vXL9IflTcQ/DKPb4j9QaXrl+kPypuIfhlHt8R+oNL1y/SH5U3EPwyj2+J6U+w1I1wcQ99uTnXHiABdZ3EbR2bQTzhvvZplsXwgCAIAgCAj11FHOwxysa9h4tcLjv7D2rEoqSwyWjWqUZqdNtNc0ZOf0Y0DnXAlb2Nfp/cCVX9Fp5ydmP8R3qWHuvvXywfA9F9F8af6Y/KnosO03/AJlvOqPg/mfX7MaL40/0x+VPRYdo/ma86o+H1H7MaL40/wBMflT0WHaP5mvOqPh9R+zGi+NP9MflT0WHaP5mvOqPh9T3pfR7Sxew+cX4jO0g+BarFvvUHmnJry8ChfbTlfRSr04PHB4aa96f0LCn2RpmOzZXO7HO08hZXJXtWSxk4yt4IvGMAAAAAHADQBVW88Sc+lgBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEBz/AG+9b9ZaW+uOpGw6jD5GtnZNmPTewkOkZltYA20NwgK87USsfg0kctRWskZUiQQxiN85Y1rQXwueAHMN73PEEoCvxfaSpfBi0gNXAWVNIxkZIbNE1+5D2NDXFrS65Ohsc2qAtJZZYqLEZm/paJ8dNIWmtkYWh1iQ6PdvNni3HqKA99j4XzFmc4ywuhN5KiSPckvZa7cryQ7pZmm2hAQH3svhshxCvY6trHso5Id218xLXB8DZHCQW6QzHs0QFRgtbVwVNN69PWQyyS5XPOWfD6gOcQ2OPIQIHOuMpIvpqgOsoAgCAIAgP4421PAIDlOym2b5cSbI6pbJT175oooA8E05gNonll7t3rWO5cXNQFfW4pVPfiIgmxJ1VHVvjp2Qtc+mDRuy1shc3dtFy693DS2iAm7QYlN69XxumxEPjigMMdC18jBI+J5dmaGloBcG2zEfxICZjZxIsonTircwUwNQzD5GR1Dai7em5twXstcZWm178kBsNi67fUMUnrBqDZwMr49y4lrnNs+O5yubbKesgnmgMJgdbVw1VN67PWwzSSljnOy1FBUhxcGRxZCBA43blNr6WN0BZ0FNU4k2sqv0hPSuiqJYoWxuaIYWwOy3ljItKXEEnMeBFrICDtdi7osQmE89eIYqSKQ+o3DQ4vkDpHN1DWkAcfEoCVhWIVo/QonleTNNPm6TSZYtzI+HebvoOdlynS+vagKDZvFKyVtK+CbEZah1SRKHtc6j3LZ3tdeR7cthGB7Lib9qA0Vbg8hxVlKK+vEUlNJOQJyCHiVjQGm2jbOOncgOjhAEAQBAEBn8a2TiqZhUCWeCbJuzJTyGMvZcnI7Qg2JNjxHXwQH9oNkKaB1I6MOb6oJRGM1wd/8AvHPvq5xOt+soDyxHYunnFUHOlHrUkUry1wBDoQ0MyG2nsBAP1Qa5k0clVVysmidE5ssocAH2u5oy6OsLA9pQHphGy4p3xuFXWPbGLCOSUOjIyloBbl1te47QEBOosFiimqZxcuqiwyBxBb/pxiMAC2gyjVAUlF6P6WJ0dpKh0UL95FTvlc6CN4NwWs46HUAkgeaA1qAIAgCAICNidEJ4ZIXOc0SNLCWGzgHCxseRseKApZ9iaN0EUDYhHuTG6OSMNbK0wkFp3lrk6a343KAssHwaOlM5jLjv5nTvzEHpva1ptYaCzBogFFg0cVRUVLc28qBGH3PR/wBEODcotp7RugIOObKRVMzakSTQTtYY97Tv3bnRk5t27Qhzb68NCgJ2C4LDSQNp4mndi98xLy4vJc5znO1cSSSe9AUlDsBTROitJUOihfvIqd8pdDE8ElpazjoTcAkgID6xPYKmnfK4vqI2TuzTwxSuZFM6wBLmDgSAAcpF7aoC1g2fhZO+oA1fCyAs03e7YXEANt/MR3ICBh2xdPB6sGOly0skkkLXOBDN61zSzUXLAHGwvp1oCzwDB46KBtPEXFjS8jMbm8kjpDqAP4nFAJMGjNUysObesidCNejlc4POluN2hAWKAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAID//2Q==" },
  { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
];

export default function HomePage() {
  const openWhatsApp = () => {
    const phoneNumber = "972508861080";
    const message = encodeURIComponent("שלום רמי, אני מעוניין בשירותי האוטומציה והפיתוח שלך. אשמח שנחזור אלי.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-500 pb-20">
      <Navigation />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden text-right">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl opacity-60" />
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-black mb-8 tracking-widest uppercase">
              <Rocket size={14} />
              <span>Rami Suite v2.0 | Next-Gen Automation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] dark:text-white tracking-tighter">
              ארכיטקטורת <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-500 via-blue-500 to-indigo-600">
                ענן ואוטומציה
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
              מומחה בבניית מערכות ליבה עסקיות המשלבות בינה מלאכותית, ניהול לוגיסטי חכם ואינטגרציה מלאה בין פלטפורמות Google ו-Microsoft.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-cyan-500/40 transition-all flex items-center gap-3 text-lg"
              >
                צפה בפורטפוליו
                <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
              </button>
              
              <button 
                onClick={openWhatsApp}
                className="flex items-center gap-3 px-6 py-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-bold hover:bg-green-500 hover:text-white transition-all shadow-sm"
              >
                <MessageSquare size={20} />
                <span>שיחת וואטסאפ מהירה</span>
              </button>
            </div>
          </motion.div>

          {/* ויזואל פרופיל יוקרתי */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative hidden lg:block"
          >
            <div className="relative z-10 p-4 rounded-[3.5rem] bg-gradient-to-br from-white/20 to-transparent backdrop-blur-xl border border-white/30 shadow-2xl">
              <div className="aspect-square bg-slate-900 rounded-[3rem] overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-1000">
                 <img 
                   src="https://github.com/Saban-94.png" 
                   alt="Rami Profile" 
                   className="w-full h-full object-cover opacity-80"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- LOGO TICKER: סרט הלוגואים הנע --- */}
      <div className="py-10 bg-white/5 border-y border-white/5 overflow-hidden flex whitespace-nowrap relative z-20">
        <motion.div 
          className="flex gap-16 flex-none items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[...techLogos, ...techLogos].map((logo, index) => (
            <img 
              key={index} 
              src={logo.src} 
              alt={logo.name} 
              className="h-8 md:h-10 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
            />
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-32 mt-20">
        {/* סטטיסטיקות */}
        <StatsGrid />

        {/* שירותים וכלים */}
        <ServicesSection />
        
        {/* פרויקטים נבחרים */}
        <section id="projects" className="scroll-mt-28">
          <ProjectsShowcase />
        </section>

        {/* דמו שליטה ומשימות */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-right">
          <PlannerDemo />
          <div className="space-y-6">
            <h2 className="text-4xl font-black dark:text-white leading-tight">
              שליטה מרכזית <br />
              <span className="text-cyan-500">בזמן אמת</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              המערכות שבניתי מתוכננות לעבודה מאומצת. סנכרון מלא של דאטה עסקי מכל מקום בעולם.
            </p>
          </div>
        </section>

        {/* צור קשר */}
        <section id="contact" className="scroll-mt-28 pb-20">
          <ContactSection />
        </section>
      </div>

      {/* --- FLOATING WHATSAPP BUTTON --- */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-8 left-8 z-50"
      >
        <button 
          onClick={openWhatsApp}
          className="p-5 bg-green-500 text-white rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-110 transition-transform flex items-center justify-center"
        >
          <Phone size={28} fill="currentColor" />
        </button>
      </motion.div>

    </main>
  );
}
