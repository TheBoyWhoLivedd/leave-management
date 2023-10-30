import React from "react";
import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";
export default function ForgotPasswordEmail({
  params,
}: {
  params: { name: string; url: string };
}) {
  return (
    <Html>
      <Heading as="h2"> Hello {params.name} </Heading>
      <Text>
        We received a reset password request from you. if it&apos;s not you then
        pls ignore it.
      </Text>
      <Button
        //@ts-expect-error
        pX={20}
        pY={20}
        href={params.url}
        style={{
          background: "#000",
          color: "#FFFFFF",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        Click Me
      </Button>
      <Hr />

      <Heading as="h3">Regards</Heading>
      <Text>Hitaji Technologies</Text>
    </Html>
  );
}
